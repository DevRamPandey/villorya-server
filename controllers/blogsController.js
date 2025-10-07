// controllers/blogController.js
const Blog = require('../models/blog');

// Helper functions for analytics
const getLastMonthStartEnd = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const lastMonthStart = new Date(lastMonthYear, lastMonth, 1);
    const lastMonthEnd = new Date(lastMonthYear, lastMonth + 1, 0, 23, 59, 59, 999);
    
    return { lastMonthStart, lastMonthEnd };
};

const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
};

// 1. Create Blog
exports.createBlog = async (req, res) => {
 try {
        const blog = new Blog({
            featureImageUrl: req.body.featureImageUrl,
            title: req.body.title,
            excerpt: req.body.excerpt,
            content: req.body.content,
            minutesOfRead: req.body.minutesOfRead,
            category: req.body.category,
            author: req.body.author,
            status: req.body.status || 'Draft',
            created_by: req.user._id,
            updated_by: req.user._id
        });

        await blog.save();
        res.status(201).send(blog);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};



// 2. Get All Blog
exports.getAllBlogs = async (req, res) => {
     try {
          // Current month and last month dates
          const now = new Date();
          const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const { lastMonthStart, lastMonthEnd } = getLastMonthStartEnd();
          
          // Get all published blogs
          const blogs = await Blog.find({ status: 'Published' })
              .sort({ createdAt: -1 })
              .select('id title featureImageUrl minutesOfRead category createdAt excerpt author views likes status created_by updated_by');
          
          // Calculate readers (unique IPs)
          const allViews = blogs.flatMap(blog => blog.views);
          const currentMonthViews = allViews.filter(view => view.timestamp >= currentMonthStart);
          const lastMonthViews = allViews.filter(view => 
              view.timestamp >= lastMonthStart && view.timestamp <= lastMonthEnd);
          
          const totalReaders = new Set(allViews.map(view => view.ipAddress)).size;
          const currentMonthReaders = new Set(currentMonthViews.map(view => view.ipAddress)).size;
          const lastMonthReaders = new Set(lastMonthViews.map(view => view.ipAddress)).size;
          
          // Calculate published blogs
          const totalPublishedBlogs = blogs.length;
          const currentMonthBlogs = await Blog.countDocuments({ 
              status: 'Published', 
              createdAt: { $gte: currentMonthStart } 
          });
          const lastMonthBlogs = await Blog.countDocuments({ 
              status: 'Published', 
              createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } 
          });
          
          // Calculate views
          const totalViews = allViews.length;
          const currentMonthViewsCount = currentMonthViews.length;
          const lastMonthViewsCount = lastMonthViews.length;
          
          // Calculate engagement rate (likes per view)
          const allLikes = blogs.flatMap(blog => blog.likes);
          const engagementRate = totalViews > 0 ? (allLikes.length / totalViews) * 100 : 0;
          
          const currentMonthLikes = allLikes.filter(like => like.timestamp >= currentMonthStart).length;
          const lastMonthLikes = allLikes.filter(like => 
              like.timestamp >= lastMonthStart && like.timestamp <= lastMonthEnd).length;
          
          const currentEngagementRate = currentMonthViewsCount > 0 ? 
              (currentMonthLikes / currentMonthViewsCount) * 100 : 0;
          const lastMonthEngagementRate = lastMonthViewsCount > 0 ? 
              (lastMonthLikes / lastMonthViewsCount) * 100 : 0;
          
          // Prepare response
          const response = {
              readers: {
                  totalReaders,
                  percentageOfIncrementFromLastMonth: calculatePercentageChange(currentMonthReaders, lastMonthReaders)
              },
              publishedBlogs: {
                  totalPublishedBlogs,
                  percentageOfIncrementFromLastMonth: calculatePercentageChange(currentMonthBlogs, lastMonthBlogs)
              },
              views: {
                  totalViews,
                  percentageOfIncrementFromLastMonth: calculatePercentageChange(currentMonthViewsCount, lastMonthViewsCount)
              },
              engagementRate: {
                  engagementRate: parseFloat(engagementRate.toFixed(2)),
                  percentageOfIncrementFromLastMonth: calculatePercentageChange(
                      currentEngagementRate, lastMonthEngagementRate
                  )
              },
              blogs: blogs.map(blog => ({
                  id: blog._id,
                  title: blog.title,
                  image: blog.featureImageUrl,
                  minuteRead: blog.minutesOfRead,
                  category: blog.category,
                  date: blog.createdAt,
                  excerpt: blog.excerpt,
                  author: blog.author,
                  views: blog.views.length,
                  like: blog.likes.length,
                  status: blog.status,
                  created_by: blog.created_by,
                  updated_by: blog.updated_by
              }))
          };
          
          res.send(response);
      } catch (error) {
          res.status(500).send({ error: error.message });
      }
};

// 3. Get Blog by Id
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ success:false,error: 'Blog not found' });
    
        // Increment views
        blog.views += 1;
        await blog.save();
    
        // Find related blogs (same categories or technologies, exclude current blog)
        const relatedBlogs = await Blog.find({
          _id: { $ne: blog._id },
          $or: [
            { categories: { $in: blog.categories } },
            { technologies: { $in: blog.technologies } }
          ]
        })
        .limit(3)
        .sort({ publicationDate: -1 });
    
        res.json({ success:true, message: 'Blog created successfully.',data:blog, relatedBlogs });
      } catch (err) {
        res.status(500).json({ success:false,error: err.message });
      }
};

// 3. Get Blog by Title
exports.getBlogByTitle = async (req, res) => {
  try {
    const slug = req.params.slug;
    const title = slug.replace(/-/g, ' '); // Convert slug to normal title

    const blog = await Blog.findOne({
      title: { $regex: new RegExp('^' + title + '$', 'i') } // case-insensitive exact match
    });

    if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });

    blog.views += 1;
    await blog.save();
     // Find related blogs (same categories or technologies, exclude current blog)
     const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      $or: [
        { categories: { $in: blog.categories } },
        { technologies: { $in: blog.technologies } }
      ]
    })
    .limit(3)
    .sort({ publicationDate: -1 });

    res.json({ success: true,data :blog,relatedBlogs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// 4. Update Blog
exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
          req.params.id,
          { ...req.body, updatedAt: Date.now() },
          { new: true }
        );
        if (!blog) return res.status(404).json({ success:false,error: 'Blog not found' });
        res.json({success:true, message: 'Blog fetched successfully.', data:blog});
      } catch (err) {
        res.status(400).json({ success:false,error: err.message });
      }
};

// 5. Delete Lead
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        res.json({success:true, message: 'Blog deleted' });
      } catch (err) {
        res.status(500).json({ success:false,error: err.message });
      }
};


// 6. Search Blog
exports.searchBlog = async (req, res) => {
    try {
        const { query } = req.query;
        const blogs = await Blog.find({
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
          ]
        });
        res.json({success:true, message: 'Blog fetched successfully.', data:blogs});
      } catch (err) {
        res.status(500).json({ success:false,error: err.message });
      }
};

// 7. Blog By Technology
exports.blogByTechnology = async (req, res) => {
    try {
        const tech = req.params.tech;
        const blogs = await Blog.find({ technologies: tech });
        res.json({success:true, message: 'Blog fetched successfully.', data:blogs});
      } catch (err) {
        res.status(500).json({ success:false,error: err.message });
      }
};

// 8.  Next Blog
exports.nextBlog = async (req, res) => {
    try {
        const currentBlog = await Blog.findById(req.params.id);
        if (!currentBlog) return res.status(404).json({ error: 'Blog not found' });
    
        const nextBlog = await Blog.findOne({
          publicationDate: { $gt: currentBlog.publicationDate }
        }).sort({ publicationDate: 1 });
    
        res.json(nextBlog?{success:true, message: 'Blog fetched successfully.', data:nextBlog} :{success:false, message: 'No Next Blog'});
      } catch (err) {
        res.status(500).json({ success:false,error: err.message });
      }
};

// 8.  Previous Blog
exports.previousBlog = async (req, res) => {
    try {
        const currentBlog = await Blog.findById(req.params.id);
        if (!currentBlog) return res.status(404).json({ error: 'Blog not found' });
    
        const previousBlog = await Blog.findOne({
          publicationDate: { $lt: currentBlog.publicationDate }
        }).sort({ publicationDate: -1 });
    
        res.json(previousBlog?{success:true, message: 'Blog fetched successfully.', data:previousBlog} : {success:false, message: 'No previous Blog'});
      } catch (err) {
        res.status(500).json({ success:false,error: err.message });
      }
};

// 9.  Like Blog
exports.likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
          req.params.id,
          { $inc: { likes: 1 } },
          { new: true }
        );
        if (!blog) return res.status(404).json({success:false, error: 'Blog not found' });
        res.json({ success:true,message: 'Liked successfully', likes: blog.likes });
      } catch (err) {
        res.status(500).json({ success:false,error: err.message });
      }
};

// 10.  Share Blog
exports.shareBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
          req.params.id,
          { $inc: { shares: 1 } },
          { new: true }
        );
        if (!blog) return res.status(404).json({ success:false,error: 'Blog not found' });
        res.json({ success:true,message: 'Shared successfully', shares: blog.shares });
      } catch (err) {
        res.status(500).json({ success:false,error: err.message });
      }
};