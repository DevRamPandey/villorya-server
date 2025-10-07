exports.dashboard = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        overview: {
          title: "Dashboard",
          subtitle: "Welcome to your admin panel overview",
        },
        stats: [
          {
            id: "package_suppliers",
            label: "Package Suppliers",
            value: 24,
            change: "+12%",
            trend: "up",
          },
          {
            id: "raw_material_suppliers",
            label: "Raw Material Suppliers",
            value: 18,
            change: "+8%",
            trend: "up",
          },
          {
            id: "cms_pages",
            label: "CMS Pages",
            value: 5,
            change: "0%",
            trend: "neutral",
          },
          {
            id: "total_questions",
            label: "Total Questions",
            value: 32,
            change: "+5%",
            trend: "up",
          },
        ],
        recentActivity: [
          {
            id: "1",
            type: "supplier_added",
            message: "New supplier added",
            timeAgo: "1 hour ago",
          },
          {
            id: "2",
            type: "supplier_added",
            message: "New supplier added",
            timeAgo: "2 hours ago",
          },
          {
            id: "3",
            type: "supplier_added",
            message: "New supplier added",
            timeAgo: "3 hours ago",
          },
          {
            id: "4",
            type: "supplier_added",
            message: "New supplier added",
            timeAgo: "4 hours ago",
          },
        ],
        quickActions: [
          {
            id: "add_package_supplier",
            title: "Add Package Supplier",
            description: "Create a new supplier entry",
            actionUrl: "/admin/package-suppliers/new",
            icon: "package",
          },
          {
            id: "add_raw_material_supplier",
            title: "Add Raw Material Supplier",
            description: "Create a new material supplier",
            actionUrl: "/admin/raw-material-suppliers/new",
            icon: "factory",
          },
          {
            id: "update_cms_content",
            title: "Update CMS Content",
            description: "Edit website content",
            actionUrl: "/admin/cms",
            icon: "edit",
          },
        ],
      },
    });
  } catch (err) {
    next(err);
  }
};
