import React from "react";

export default function NewsLetters() {
    return (
        <div className="container py-16 mx-auto">
            <div className="relative flex items-center justify-center w-full ">
                <img src="https://img.freepik.com/free-photo/photorealistic-money-with-plant_23-2151027606.jpg?uid=R176823449&ga=GA1.1.1433286368.1718702777&semt=ais_hybrid" alt="dining" className="absolute z-0 hidden w-full h-full xl:block" />
                <img src="https://img.freepik.com/free-photo/photorealistic-money-with-plant_23-2151027606.jpg?uid=R176823449&ga=GA1.1.1433286368.1718702777&semt=ais_hybrid" alt="dining" className="absolute z-0 hidden w-full h-full sm:block xl:hidden" />
                <img src="https://img.freepik.com/free-photo/photorealistic-money-with-plant_23-2151027606.jpg?uid=R176823449&ga=GA1.1.1433286368.1718702777&semt=ais_hybrid" alt="dining" className="absolute z-0 w-full h-full sm:hidden " />
                <div className="relative z-40 flex flex-col items-center justify-center w-full px-4 py-10 bg-gray-800/50 bg-opacity-80 md:my-16 lg:py-16 md:mx-24 md:px-12">
                    <h1 className="text-4xl font-semibold leading-9 text-center text-white">Don’t miss out!</h1>
                    <p className="mt-6 text-base leading-normal text-center text-white">
                    Subscribe to our newsletter and get exclusive updates, expert strategies, 
                    <br />and special offers straight to your inbox. Don’t miss your chance to stay ahead in the trading world!
                    </p>
                    <div className="flex flex-col items-center w-full mt-12 space-y-4 border-white sm:border sm:flex-row lg:w-5/12 sm:space-y-0">
                        <input className="w-full p-4 text-base font-medium leading-none text-white placeholder-white bg-transparent border border-white sm:border-transparent focus:outline-none" placeholder="Email Address" />
                        <button className="w-full px-6 py-4 bg-white border border-white focus:outline-none focus:ring-offset-2 focus:ring sm:border-transparent sm:w-auto hover:bg-opacity-75">Subscribe</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
