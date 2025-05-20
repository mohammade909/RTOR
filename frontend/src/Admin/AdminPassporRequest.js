import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { GrEdit } from "react-icons/gr";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import Loader from "../BaseFile/comman/Loader";
import {
  getAllPassport,
  deletePassport,
  addTicket,
  clearErrors,
  clearMessage,
} from "../redux/passportSlice";
import { Confirmation } from "../BaseFile/comman/Confirmation";

export default function AdminPassporRequest() {
  const dispatch = useDispatch();
  const [allPass, setAllPass] = useState([]);
  const [deleteID, setDeleteID] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isId, setIsId] = useState(null);
  const [formData, setFormData] = useState({
    ticket_two: "",
    ticket_date: "",
    ticket_image: null,
  });

  const { allpassport, loading, error, message } = useSelector(
    (state) => state.passport
  );

  useEffect(() => {
    dispatch(getAllPassport());

    if (error) {
      const errorInterval = setInterval(() => {
        dispatch(clearErrors());
      }, 3000);
      return () => clearInterval(errorInterval);
    }
    if (message) {
      const messageInterval = setInterval(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearInterval(messageInterval);
    }
  }, [dispatch, error, message]);

  const handleSearch = (e) => {
    setAllPass(allpassport?.filter((p) => p?.email.includes(e.target.value)));
    setSearchQuery(e.target.value);
  };

  const handleDelete = (id) => {
    setDeleteID(id);
    setModalOpen(true);
  };

  const isClose = () => {
    setModalOpen(false);
  };

  const handleImageClick = (imageName) => {
    setPreviewImage(`/uploads/passport/${imageName}`);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  const toggleModal = (id) => {
    setIsId(id);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fdata = new FormData();
    fdata.append("ticket_two", formData.ticket_two);
    fdata.append("ticket_date", formData.ticket_date);
    fdata.append("ticket_image", formData.ticket_image);
    fdata.append("user_id", isId);
    if (formData.ticket_image == null) {
      return alert("add image");
    }
    dispatch(addTicket(fdata));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-gray-900 min-h-screen">
          <div className="px-4 md:px-8 pt-5">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <input
              id="search"
              name="search"
              value={searchQuery}
              onChange={handleSearch}
              type="text"
              placeholder="Search email here..."
              className="block w-full md:w-[50vh] px-2 py-1 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
            />
          </div>

          <div className="mt-4 flow-root">
            {message && <SuccessAlert message={message} />}
            {error && <ErrorAlert error={error} />}
            <div className="overflow-x-auto">
              <table className="z-10 mt-6 w-full text-left border-collapse">
                <thead className="border-b border-gray-300 text-lg leading-6 text-white bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="py-2 pl-2 pl-2 font-semibold border-r border-gray-300"
                    >
                      E-Mail
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-2 font-semibold border-r border-gray-300"
                    >
                      Passport Number
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-2 font-semibold border-r border-gray-300"
                    >
                      Adhar Number
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-2 font-semibold border-r border-gray-300"
                    >
                      Passport
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-2 font-semibold border-r border-gray-300"
                    >
                      Adhar
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-2 font-semibold border-r border-gray-300"
                    >
                      Ticket
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-2 font-semibold border-r border-gray-300"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-2 font-semibold border-r border-gray-300"
                    >
                      To
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-2 font-semibold border-r border-gray-300"
                    >
                      At
                    </th>
                    <th scope="col" className="py-2 pl-2 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {(searchQuery ? allPass : allpassport)
                    ?.slice()
                    .reverse()
                    .map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-4 pl-2 border-r border-gray-200">
                          <Link
                            to={`/admin/check/profile/${item?.user_id}`}
                            className="truncate text-lg font-medium leading-6 text-white"
                          >
                            {item?.email}
                          </Link>
                        </td>
                        <td className="py-4 border-r pl-2 border-gray-200">
                          <div className="font-mono text-lg text-gray-400">
                            {item?.passport_num}
                          </div>
                        </td>
                        <td className="py-4 border-r pl-2 border-gray-200">
                          <div className="rounded-md bg-gray-700/40 px-2 py-1 text-xs text-gray-400">
                            {item?.adhar_num}
                          </div>
                        </td>
                        <td className="py-4 border-r pl-2 border-gray-200">
                          {item?.passport_image && (
                            <button
                              onClick={() =>
                                handleImageClick(item?.passport_image)
                              }
                              className="text-blue-400 hover:underline"
                            >
                              {item?.passport_image?.slice(0, 10)}
                            </button>
                          )}
                        </td>
                        <td className="py-4 border-r pl-2 border-gray-200">
                          {item?.adhar_image && (
                            <button
                              onClick={() =>
                                handleImageClick(item?.adhar_image)
                              }
                              className="text-blue-400 hover:underline"
                            >
                              {item?.adhar_image?.slice(0, 10)}
                            </button>
                          )}
                        </td>
                        <td className="py-4 border-r pl-2 border-gray-200">
                          {item?.ticket_image && (
                            <button
                              onClick={() =>
                                handleImageClick(item?.ticket_image)
                              }
                              className="text-blue-400 hover:underline"
                            >
                              {item?.ticket_image?.slice(0, 10)}
                            </button>
                          )}
                        </td>
                        <td className="py-4 border-r pl-2 border-gray-200">
                          <div className="font-mono text-lg text-gray-400">
                            {item?.ticket_date}
                          </div>
                        </td>

                        <td className="py-4 border-r pl-2 border-gray-200">
                          <div className="font-mono text-lg text-gray-400">
                            {item?.ticket_two}
                          </div>
                        </td>
                        <td className="py-4 pl-2 pr-4 sm:table-cell sm:pr-8 border-r border-gray-200">
                          <div className="rounded-md bg-gray-700/40 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-gray-300">
                            {new Date(item?.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 pl-2">
                          <div className="flex items-center space-x-2">
                            <>
                              <AiFillDelete
                                className="h-4 w-4 text-red-400 cursor-pointer"
                                onClick={() => handleDelete(item?.id)}
                              />
                              <div>
                                <div className="flex items-center justify-center">
                                  <IoIosAddCircleOutline
                                    className="text-white w-5 h-5 cursor-pointer"
                                    onClick={() => toggleModal(item?.id)}
                                  />
                                  {isId && (
                                    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                                      <div className="bg-black p-6 rounded-lg border w-1/3">
                                      <div className="flex justify-between">
                                        <h2 className="text-xl font-bold mb-4 text-white">
                                         
                                          Ticket
                                        </h2>
                                        <button onClick={() => setIsId(null)}>
                                          <div className="group flex cursor-pointer items-center justify-center mb-2 ">
                                            <div className="space-y-2">
                                              <span className="block h-1 w-10 origin-center rounded-full bg-slate-500 transition-transform ease-in-out group-hover:translate-y-1.5 group-hover:rotate-45"></span>
                                              <span className="block h-1 w-8 origin-center rounded-full bg-orange-500 transition-transform ease-in-out group-hover:w-10 group-hover:-translate-y-1.5 group-hover:-rotate-45"></span>
                                            </div>
                                          </div>
                                        </button>
                                        </div>
                                        <form
                                          onSubmit={handleSubmit}
                                          className="space-y-4 "
                                        >
                                          <div>
                                            <label
                                              htmlFor="ticket_two"
                                              className="block text-[13px] font-medium text-gray-200"
                                            >
                                              Place
                                            </label>
                                            <input
                                              type="text"
                                              id="ticket_two"
                                              name="ticket_two"
                                              required
                                              placeholder="Enter Ticket"
                                              value={formData.ticket_two}
                                              onChange={handleChange}
                                              className="mt-1 block w-full text-white bg-gray-900 text-[12px] px-4 py-2 border border-gray-300 placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="ticket_date"
                                              className="block text-[13px] font-medium text-gray-200"
                                            >
                                              Ticket Date
                                            </label>
                                            <input
                                              type="date"
                                              id="ticket_date"
                                              name="ticket_date"
                                              required
                                              value={formData.ticket_date}
                                              onChange={handleChange}
                                              className="mt-1 block w-full text-[12px] px-4 py-2 bg-gray-900 text-gray-200 border placeholder:text-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="ticket_image"
                                              className="block text-[13px] font-medium text-gray-200"
                                            >
                                              Upload Ticket Image
                                            </label>
                                            <input
                                              type="file"
                                              id="ticket_image"
                                              name="ticket_image"
                                              accept="image/*"
                                              required
                                              onChange={handleChange}
                                              className="mt-1 block w-full p-2 text-[12px] bg-gray-900 text-gray-200  border placeholder:text-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                          </div>
                                          <div>
                                            <button
                                              type="submit"
                                              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                              Submit
                                            </button>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          {previewImage && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-w-full max-h-screen object-contain"
                />
                <button
                  onClick={handleClosePreview}
                  className="absolute top-2 right-2 text-white text-xl bg-black p-2 rounded-full"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          {modalOpen && (
            <Confirmation
              isClose={isClose}
              id={deleteID}
              deletefunction={deletePassport}
            />
          )}
        </div>
      )}
    </>
  );
}
