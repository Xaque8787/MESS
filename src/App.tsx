import React from 'react';
import { Download } from 'lucide-react';
import { CategorySection } from './components/CategorySection';
import { ConfirmationDialog } from './components/ConfirmationDialog';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useAppSelections } from './hooks/useAppSelections';
import { APP_CATEGORIES } from './data/categories';

function App() {
  const {
    apps,
    loading,
    error,
    showConfirmation,
    pendingChanges,
    handleSelect,
    handleInstall,
    handleRemove,
    handleUpdate,
    handleInitialize,
    confirmChanges,
    cancelChanges
  } = useAppSelections();
  
  const hasChanges = 
    pendingChanges.installs.length > 0 ||
    pendingChanges.removals.length > 0 ||
    pendingChanges.updates.length > 0;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Media Essentials Server Setup</h1>
          <p className="text-gray-500 mb-6">
            Select and configure applications for your server.
          </p>
          
          {error && <ErrorMessage message={error} />}
          
          {APP_CATEGORIES.map(category => {
            const categoryApps = apps.filter(app => app.category === category);
            if (categoryApps.length === 0) return null;
            
            return (
              <CategorySection
                key={category}
                category={category}
                apps={categoryApps}
                allApps={apps} // Pass all apps here
                onSelect={handleSelect}
                onInstall={handleInstall}
                onRemove={handleRemove}
                onUpdate={handleUpdate}
              />
            );
          })}
        </div>

        <button
          onClick={handleInitialize}
          disabled={!hasChanges}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors
            ${hasChanges
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          <Download className="w-5 h-5" />
          Apply Changes
        </button>
      </div>

      {showConfirmation && (
        <ConfirmationDialog
          changes={pendingChanges}
          onConfirm={confirmChanges}
          onCancel={cancelChanges}
        />
      )}
    </div>
  );
}

export default App;
