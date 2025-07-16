import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
  currentFolderId?: string;
  currentFolderName?: string;
}

export default function Breadcrumbs({ currentFolderId, currentFolderName }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-300 mb-4">
      <Link 
        to="/folders" 
        className="hover:text-white flex items-center"
      >
       Home 
      </Link>
      
      {currentFolderId && (
        <>
          <FontAwesomeIcon 
            icon={faChevronRight} 
            className="text-gray-600" 
          />
          <span className="text-white">
            {currentFolderName}
          </span>
        </>
      )}
    </nav>
  );
} 