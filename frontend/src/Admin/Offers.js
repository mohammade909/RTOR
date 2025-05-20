// Offers List Component
import React, { useState, useEffect } from "react";

import { Trash2, Eye, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchOffers, deleteOffer, resetState } from "../redux/offer";
import { useDispatch, useSelector } from "react-redux";
import { format, set } from "date-fns";
import { Link } from "react-router-dom";
import CountdownTimer from "../CoreFile/Timer";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import UpdateOfferModal from "./OfferUpdateModal";
import OfferDetailsModal from "./OfferDetails";
export function Card({ children, className, ...props }) {
  return (
    <div
      className={`border rounded-sm shadow-sm overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={`p-4 border-b bg-[#e62e2e] ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h2
      className={`text-xl font-semibold text-gray-100 ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={`text-sm text-gray-300 mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) {
  const variantStyles = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-gray-300  hover:bg-gray-100",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };

  const sizeStyles = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`
        rounded-md 
        transition-colors 
        focus:outline-none 
        focus:ring-2 
        focus:ring-offset-2 
        ${variantStyles[variant]} 
        ${sizeStyles[size]} 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  className = "",
  variant = "default",
  ...props
}) {
  const variantStyles = {
    default: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`
        px-2 py-1 
        rounded-full 
        text-xs 
        font-medium 
        ${variantStyles[variant]} 
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}

const OffersListComponent = () => {
  const dispatch = useDispatch();
  const { offers, message, error } = useSelector((state) => state.offers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState({});

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 4;

  // Pagination calculations
  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = offers?.slice(indexOfFirstOffer, indexOfLastOffer);
  const totalPages = Math.ceil(offers.length / offersPerPage);

  // Handlers
  const handleDelete = (id) => {
    // Implement delete logic
    dispatch(deleteOffer(id));
    console.log(`Delete offer ${id}`);
  };

  const handleUpdate = (offer) => {
    setCurrentOffer(offer);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(resetState());
      }, 2000); // 2 seconds delay

      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);
  return (
    <div className="container mx-auto px-4  py-5">
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}
      <Card className="mb-4">
        <CardHeader className="flex justify-between items-center bg-[#7050d1b3] text-white">
          <div>
            <CardTitle>Available Offers</CardTitle>
            <CardDescription>
              Explore current opportunities and rewards
            </CardDescription>
          </div>
          <Button>
            <Link to={"/admin/offer-form"}>Create Offer</Link>
          </Button>
        </CardHeader>
      </Card>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3   gap-4">
        {currentOffers?.map((offer) => (
          <Card
            key={offer.offer_id}
            className="hover:shadow-md transition-shadow bg-[#2e45bae0] "
          >
            <CardHeader>
              <div className="flex justify-between items-center ">
                <CardTitle className="text-lg">{offer.title}</CardTitle>
                <Badge
                  variant={
                    offer.status === "Active"
                      ? "green"
                      : offer.status === "Pending"
                      ? "yellow"
                      : "default"
                  }
                >
                  {offer.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm  text-white mb-2">{offer.description}</p>
              <div className=" flex justify-center bg-black mb-3">
                <CountdownTimer
                  startDate={offer.start_date}
                  endDate={offer.end_date}
                />
              </div>

              <div className="space-y-2 text-white">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Business Value:</span>
                  <span className="text-sm">${offer.business_val}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Reward:</span>
                  <span className="text-sm">${offer.reward}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-medium">Start Date:</span>
                  <span className="text-sm">
                    {format(new Date(offer.start_date), "MMMM dd, yyyy h:mm a")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">End Date:</span>
                  <span className="text-sm">
                    {format(new Date(offer.end_date), "MMMM dd, yyyy h:mm a")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Available For :</span>
                  <span className="text-sm">
                    {offer.users == 1 ? "All Users" : "Particular Users"}
                  </span>
                </div>
              </div>
            </CardContent>
            <div className=" flex justify-between gap-3 mt-1 border-t p-4 ">
              <Button
                variant="outline"
                size="sm"
                className="flex justify-center py-3 w-full text-white bg-yellow-600"
              >
                <Link className="flex justify-center gap-2  " to={`/admin/offers/${offer?.offer_id}`}>
                  <Eye className="h-4 w-4 border-0 text-white" />
                  View
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdate(offer)}
                className="flex justify-center gap-2 py-3  w-full text-white bg-indigo-500"
              >
                <Edit className="h-4 w-4 text-white" /> Update
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(offer.offer_id)}
                className="flex justify-center gap-2 py-3 w-full text-white bg-indigo-500"
              >
                <Trash2 className="h-4 w-4 text-white " /> Delete
              </Button>
            </div>
          </Card>
        ))}
      </div> */}
      <div className="overflow-x-auto  rounded-sm shadow-md mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-900 ">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">
                Title & Description
              </th>
              <th className="px-4 py-3 w-72 text-center text-xs font-semibold text-gray-300 uppercase">
                Timer
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">
                Business Value & Reward
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">
                Start & End Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">
                Available For &   Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOffers?.map((offer) => (
              <tr key={offer.offer_id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                 
                  <span className="block"> {offer.title}</span>
                  <span className="block"> {offer.description}</span>
                </td>
                <td className="px-4 py-3 text-sm text-center w-72">
                  <div className=" text-gray-800 border border-gray-300 shadow p-1 inline-block">
                    <CountdownTimer
                      startDate={offer.start_date}
                      endDate={offer.end_date}
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                <span className="block">  ${offer.business_val}</span>
                <span className="block"> Reward : ${offer.reward}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <span className="block"> {format(new Date(offer.start_date), "MMMM dd, yyyy h:mm a")}</span>
                  <span className="block"> {format(new Date(offer.end_date), "MMMM dd, yyyy h:mm a")}</span>
                 
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                 
                  <span className="block"> {offer.users === 1 ? "All Users" : "Particular Users"}</span>
                  <span className="block mt-2"> <Badge
                    variant={
                      offer.status === "Active"
                        ? "green"
                        : offer.status === "Pending"
                        ? "yellow"
                        : "default"
                    }
                  >
                    {offer.status}
                  </Badge></span>
                </td>
                <td className="px-4 py-3 flex gap-2 justify-center">
                  <Link
                    to={`/admin/offers/${offer?.offer_id}`}
                    className=" text-yellow-600 hover:text-yellow-700 p-1 rounded-md text-sm flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleUpdate(offer)}
                    className=" text-indigo-600 hover:text-indigo-700 p-1 rounded-md text-sm flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(offer.offer_id)}
                    className=" text-red-600 hover:text-red-700 p-1 rounded-md text-sm flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UpdateOfferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        offerData={currentOffer}
      />

      {/* Pagination */}
      <div className="flex justify-between mt-6 space-x-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex gap-2 items-center text-white bg-red-600 hover:bg-red-700"
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
        </Button>
        <span className="self-center text-white text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          className="flex gap-2 items-center bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OffersListComponent;
