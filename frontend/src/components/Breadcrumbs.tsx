import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useFolderHierarchy } from '../stores/useFolderHierarchy';

interface BreadcrumbsProps {
  currentFolderId?: string;
}

export default function Breadcrumbs({ currentFolderId }: BreadcrumbsProps) {
  const { hierarchy, fetchHierarchy, setHierarchy } = useFolderHierarchy();
  const MAX_VISIBLE_ITEMS = 5;

  useEffect(() => {
    if (currentFolderId) {
      fetchHierarchy(currentFolderId);
    } else {
      setHierarchy([]);
    }
  }, [currentFolderId, fetchHierarchy, setHierarchy]);

  const renderBreadcrumbItem = (folder: { id: string; name: string }, isLast: boolean) => (
    <div key={folder.id} className="flex items-center space-x-2">
      <FontAwesomeIcon 
        icon={faChevronRight} 
        className="text-gray-600" 
      />
      {isLast ? (
        <span className="text-white">
          {folder.name}
        </span>
      ) : (
        <Link 
          to={`/folders/${folder.id}`}
          className="hover:text-white"
        >
          {folder.name}
        </Link>
      )}
    </div>
  );

  const renderBreadcrumbs = () => {
    if (hierarchy.length <= MAX_VISIBLE_ITEMS) {
      return hierarchy.map((folder, index) => 
        renderBreadcrumbItem(folder, index === hierarchy.length - 1)
      );
    }
    
    // Show first 2, ellipsis, last 2
    const firstItems = hierarchy.slice(0, 2);
    const lastItems = hierarchy.slice(-2);
    
    return [
      ...firstItems.map((folder) => 
        renderBreadcrumbItem(folder, false)
      ),
      <div key="ellipsis" className="flex items-center space-x-2">
        <FontAwesomeIcon 
          icon={faChevronRight} 
          className="text-gray-600" 
        />
        <span className="text-gray-500">...</span>
      </div>,
      ...lastItems.map((folder, index) => 
        renderBreadcrumbItem(folder, index === lastItems.length - 1)
      )
    ];
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-300 mb-4 overflow-hidden">
      <Link 
        to="/folders" 
        className="hover:text-white flex items-center"
      >
        Home
      </Link>
      
      {renderBreadcrumbs()}
    </nav>
  );
} 