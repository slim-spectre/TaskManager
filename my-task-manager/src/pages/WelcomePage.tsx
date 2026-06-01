import {Link} from 'react-router-dom'


function WelcomePage(){
    return (
        <div className="welcomePage">
            <header>
                <div className='header-title'>Dakota Task Manager</div>
                <div>
                        <Link to='/login' className='auth-btn'>Log In</Link>
                        <Link to='/register' className='auth-btn'>Sign up</Link>
                </div>
            </header>

            <main>
                <div>
                    <h1 className='mainTitle'>Best Task Manager</h1>
                    <h2 className='mainDescription'>Organize your tasks, monitor deadlines and increase productivity</h2>
                </div>
                <div>
                    <img className='mainImg' src="../../public/images/task.jpg" alt="Website Interface" />
                </div>
            </main>
            
        </div>
    );
}

export default WelcomePage