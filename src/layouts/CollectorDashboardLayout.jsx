import React from 'react';

/**
 * Layout wrapper for the Collector Dashboard page.
 * Provides a gradient background and centralised container.
 * Uses Tailwind utility classes; additional glassmorphism can be applied via the .glass class.
 */
const CollectorDashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default CollectorDashboardLayout;
