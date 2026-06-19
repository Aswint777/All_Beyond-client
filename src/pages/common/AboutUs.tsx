
import UserNavbar from "../../components/layout/UserNavbar";
import BasicNavbar from "../../components/layout/BasicNavbar";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

function AboutUs() {
      const { userDetails } = useSelector((state: RootState) => state.user);

  return (
    <div className="bg-gray-100 font-sans min-h-screen">
      {userDetails ? <UserNavbar /> : <BasicNavbar />}


      <main className="container mx-auto py-10 px-4">
                    <img
              src="/src/assets/images/B (4).png"
              alt="EduPlatform Logo"
              className="mx-auto h-28 mb-4 mt-14"
            />
        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
            About All Beyond
          </h2>
          
          <p className="text-gray-600 leading-relaxed mb-6 text-center">
            Welcome to <span className="font-bold">All Beyond</span>, your
            ultimate platform for seamless and secure communication! Founded in
            2020 by a group of passionate tech enthusiasts, ChatVerse is
            dedicated to connecting people across the globe with innovative and
            user-friendly chat solutions.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6 text-center">
            At ChatVerse, we believe in the power of conversation. Whether
            you're catching up with friends, collaborating with colleagues, or
            building new connections, our app provides a reliable and intuitive
            experience tailored to your needs. With features like end-to-end
            encryption, group chats, and multimedia sharing, we ensure that your
            conversations are both fun and secure.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed text-center">
            Our mission is to bridge the gap between people through technology.
            We aim to create a platform where everyone can communicate
            effortlessly, regardless of distance or device. ChatVerse is
            committed to fostering meaningful connections while prioritizing
            user privacy and security.
          </p>
        </section>
      </main>
    </div>
  );
}

export default AboutUs;
