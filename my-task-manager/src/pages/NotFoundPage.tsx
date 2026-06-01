import { Link } from 'react-router-dom';
import '../styles/NotFoundPage.css'; 

function NotFoundPage() {
    return (
        <div className="not-found-container">
            <img src="../../public/images/1_wBTs2YZSlap-clR2kLLZdQ.png" alt="" />
            <p>Oops! The page you're looking for doesn't exist.</p>
            <Link to="/" className="home-link">Go back home</Link>
        </div>
    );
}

export default NotFoundPage;