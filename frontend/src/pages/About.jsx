export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About LinkVault
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Secure, Private, Temporary Link Sharing
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Project Overview */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What is LinkVault?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              LinkVault is a secure platform for sharing text and files
              temporarily. It provides advanced privacy controls including
              password protection, automatic expiration, and view limits to
              ensure your shared content remains private and controlled.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Whether you need to share sensitive information, code snippets, or
              temporary files, LinkVault ensures your data is shared securely
              and automatically deleted after the specified conditions are met.
            </p>
          </section>

          {/* Features */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🔒</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Password Protection
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add an extra layer of security with password-protected
                    pastes
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⏱️</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Auto Expiration
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Set custom expiration times or dates for automatic deletion
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👁️</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    View Limits
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Control how many times your paste can be viewed
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📁</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    File Sharing
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Share files up to 10MB with the same security features
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🔐</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    One-Time View
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create self-destructing pastes that delete after first view
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    User Accounts
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Track and manage your pastes with optional user accounts
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Developer Info */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  D
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Durgesh Pratap Singh
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-3">
                  MTech CSE Student, IIT Kharagpur
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This project was developed as part of the Design Lab course at
                  Indian Institute of Technology, Kharagpur. It demonstrates the
                  implementation of secure, temporary data sharing with modern
                  web technologies.
                </p>
                <div className="flex gap-4 justify-center md:justify-start">
                  <a
                    href="https://github.com/Durgeshpratapsingh123"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com/in/durgesh120103/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Tech Stack */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Technology Stack
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-3xl mb-2">⚛️</div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  React
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Frontend
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-3xl mb-2">🟢</div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Node.js
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Backend
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-3xl mb-2">🍃</div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  MongoDB
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Database
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-3xl mb-2">🎨</div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Tailwind
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Styling
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
