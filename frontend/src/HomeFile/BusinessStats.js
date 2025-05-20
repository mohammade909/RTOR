import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const blogs = [
  {
    category: "Robot Technology",
    date: "10 FEB 2023",
    author: "JOHN DOE",
    title: "Officia deserunt mollitia animi nobis",
    image: "https://img.freepik.com/free-photo/full-shot-people-coins_23-2151027568.jpg?uid=R176823449&ga=GA1.1.1433286368.1718702777&semt=ais_hybrid",
  },
  {
    category: "User Research",
    title: "Eum iure reprehenderit velit esse",
    date: "7 JUN 2023",
    author: "MARK ADAIR",
    image: "https://img.freepik.com/premium-psd/blue-coin-with-x-it-cross-top_1155620-2854.jpg?uid=R176823449&ga=GA1.1.1433286368.1718702777&semt=ais_hybrid",
  },
  {
    category: "Machine Learning",
    date: "5 OCT 2023",
    author: "SIMON KONECKI",
    title: "Duis aute irure dolor in reprehenderit",
    image: "https://img.freepik.com/free-photo/photorealistic-money-with-plant_23-2151027561.jpg?uid=R176823449&ga=GA1.1.1433286368.1718702777&semt=ais_hybrid",
  },
  {
    category: "Data Science",
    date: "5 OCT 2023",
    author: "SIMON KONECKI",
    title: "Numquam eius modi tempora incidunt labore",
    image: "https://img.freepik.com/premium-photo/making-money-online_1199903-60564.jpg?uid=R176823449&ga=GA1.1.1433286368.1718702777&semt=ais_hybrid",
  },
  {
    category: "Artificial Intelligence",
    date: "5 OCT 2023",
    author: "SIMON KONECKI",
    title: "Placeat non recusae deleniti",
    image: "https://img.freepik.com/free-photo/individual-expressing-concern-about-rising-cost-living_23-2151735300.jpg?uid=R176823449&ga=GA1.1.1433286368.1718702777&semt=ais_hybrid",
  },
  {
    category: "UI Execution",
    date: "5 OCT 2023",
    author: "SIMON KONECKI",
    title: "Exercitation ullamco laboris nisi",
    image: "https://img.freepik.com/free-photo/3d-render-hourglass-with-gold-coins-wallpaper_1409-7174.jpg?uid=R176823449&ga=GA1.1.1433286368.1718702777&semt=ais_hybrid",
  },
];

const BusinessStats = () => {
  return (
    <section className="px-2 pt-8 pb-4 bg-gray-50 sm:px-0">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-2 text-blue-600">
          <span className="text-sm">— OUR BLOGS</span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-4 ">
          <span className="mb-1 text-3xl font-semibold text-transparent sm:text-4xl bg-gradient-to-r from-red-700 via-green-600 to-yellow-500 bg-clip-text">—  Explore Our Blogs</span>
        </div>
        </div>

        <div className="mb-12">
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            grabCursor={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              550: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            modules={[Autoplay, Navigation]}
            className="w-full swiper"
          >
            {blogs.map((blog, index) => (
              <SwiperSlide key={index}>
          
            <div
              key={blog.id}
              className="bg-white cursor-pointer rounded-lg overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative group"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-96 object-cover"
              />
              <div className="p-6 absolute bottom-0 left-0 right-0 bg-black/50 opacity-90">
                <span className="text-sm block text-gray-200 mb-2">
                  {blog.date} | BY {blog.author}
                </span>
                <h3 className="text-lg font-semibold text-gray-200">{blog.category}</h3>
                <div className="h-0 overflow-hidden group-hover:h-8 text-justify group-hover:mt-2 transition-all duration-300">
                  <p className="text-gray-200 text-base">{blog.title}</p>
                </div>
              </div>
            </div>
      
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default BusinessStats;
