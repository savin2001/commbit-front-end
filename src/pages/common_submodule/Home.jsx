import { Link } from "react-router-dom";
import Navbar from "../../components/navbars/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="hero min-h-screen bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500">
        <div className="hero-content text-center text-white">
          <div className="container mx-auto">
            <h1 className="text-5xl font-bold mb-6">Welcome to Commbit System</h1>
            <p className="text-xl mb-12">
              Commbit System is an all-in-one platform that empowers you to effectively manage events, share documents, and streamline content management. With our user-friendly interface and comprehensive features, you can easily organize events, securely store and share documents, and efficiently manage all your content. Stay connected, collaborate seamlessly, and simplify your workflow with Commbit System.
            </p>
            <Link to={"/login"} className="btn btn-primary py-3 px-8 text-xl font-bold">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
