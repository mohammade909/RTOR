import { useState, useEffect } from "react";
import { Description, Field, Label, Switch } from "@headlessui/react";
import {
  getSettings,
  clearErrors,
  clearMessage,
  updateSettings,
} from "../redux/settingsSlice";
import { useDispatch, useSelector } from "react-redux";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
export default function AdminSetting() {
  const dispatch = useDispatch();
  const { settings, loading, error, message } = useSelector(
    (state) => state.settings
  );

  // Initialize states based on settings from backend
  const [level, setLevel] = useState(false);
  const [direct, setDirect] = useState(false);
  const [reward, setReward] = useState(false);
  const [register, setRegister] = useState(false);
  const [login, setLogin] = useState(false);
  const [withdrawal, setWithdrawal] = useState(false);
  const [deposite, setDeposite] = useState(false);
  const [roi, setRoi] = useState(false);
  const [support, setSupport] = useState(false);
  const [topup, setTopup] = useState(false);

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setLevel(settings.setlevel === 1);
      setDirect(settings.setdirect === 1);
      setReward(settings.setreward === 1);
      setRegister(settings.setregister === 1);
      setLogin(settings.setlogin === 1);
      setWithdrawal(settings.setwithdrawal === 1);
      setDeposite(settings.setdeposite === 1);
      setRoi(settings.setroi === 1);
      setSupport(settings.setsupport === 1);
      setTopup(settings.settopup === 1);
    }
  }, [settings]);

  useEffect(() => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = {
      level,
      direct,
      reward,
      register,
      login,
      withdrawal,
      deposite,
      roi,
      support,
      topup,
    };
    dispatch(updateSettings(values));
  };

  return (
    <div>
      <main className="">
        <div className="max-w-full mx-auto ">
          <div className="pt-5 pb-8 overflow-hidden text-gray-800 px-4  rounded-md ">
            <div className="divide-y divide-gray-200 lg:divide-x lg:divide-y-0 ">
              {message && <SuccessAlert message={message} />}
              {error && <ErrorAlert error={error} />}
              <form
                className="divide-y divide-gray-200 lg:col-span-9"
                onSubmit={handleSubmit}
              >
                <div className="divide-y divide-gray-200 ">
                  <div className="">
                    <div>
                      <h2 className="text-xl  font-medium leading-6 ">
                        App settings
                      </h2>
                      <p className=" text-base ">
                       Yoy can turn on and off some settings here
                      </p>
                    </div>
                    <ul role="list" className="mt-2 divide-y bg-white divide-gray-200">
                      <div className="grid lg:grid-cols-2 grid-cols-1  gap-x-4">
                        <div className=" p-2 mb-6 space-y-4  border border-white/50">
                          <Field
                            as="li"
                            className="flex items-center justify-between  "
                          >
                            <div className="flex flex-col ">
                              <Label
                                as="p"
                                passive
                                className="text-base font-medium leading-6 "
                              >
                                Allow Level Income
                              </Label>
                              <Description className="text-base ">
                                You can turn on and off level income for users.
                              </Description>
                            </div>
                            <Switch
                              checked={level}
                              onChange={setLevel}
                              className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
                            >
                              <span
                                aria-hidden="true"
                                className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                              />
                            </Switch>
                          </Field>
                          <Field
                            as="li"
                            className="flex items-center justify-between  "
                          >
                            <div className="flex flex-col">
                              <Label
                                as="p"
                                passive
                                className="text-base font-medium leading-6 "
                              >
                                Allow Direct Income
                              </Label>
                              <Description className="text-base ">
                                You can turn on and off direct income for users.
                              </Description>
                            </div>
                            <Switch
                              checked={direct}
                              onChange={setDirect}
                              className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
                            >
                              <span
                                aria-hidden="true"
                                className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                              />
                            </Switch>
                          </Field>
                          <Field
                            as="li"
                            className="flex items-center justify-between  "
                          >
                            <div className="flex flex-col">
                              <Label
                                as="p"
                                passive
                                className="text-base font-medium leading-6 "
                              >
                                Allow Reward
                              </Label>
                              <Description className="text-base ">
                                You can turn on and off rewards for users.
                              </Description>
                            </div>
                            <Switch
                              checked={reward}
                              onChange={setReward}
                              className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
                            >
                              <span
                                aria-hidden="true"
                                className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                              />
                            </Switch>
                          </Field>
                          <Field
                            as="li"
                            className="flex items-center justify-between "
                          >
                            <div className="flex flex-col">
                              <Label
                                as="p"
                                passive
                                className="text-base font-medium leading-6 "
                              >
                                Allow New Registration
                              </Label>
                              <Description className="text-base ">
                                You can turn on and off new registrations for
                                new users.
                              </Description>
                            </div>
                            <Switch
                              checked={register}
                              onChange={setRegister}
                              className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
                            >
                              <span
                                aria-hidden="true"
                                className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                              />
                            </Switch>
                          </Field>
                          <Field
                            as="li"
                            className="flex items-center justify-between  "
                          >
                            <div className="flex flex-col">
                              <Label
                                as="p"
                                passive
                                className="text-base font-medium leading-6 "
                              >
                                Allow Login
                              </Label>
                              <Description className="text-base">
                                You can turn on and off login for users.
                              </Description>
                            </div>
                            <Switch
                              checked={login}
                              onChange={setLogin}
                              className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
                            >
                              <span
                                aria-hidden="true"
                                className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                              />
                            </Switch>
                          </Field>
                        </div>
                        <div className=" border border-white/50 p-2  mb-6 space-y-4">
                          <Field
                            as="li"
                            className="flex items-center justify-between "
                          >
                            <div className="flex flex-col">
                              <Label
                                as="p"
                                passive
                                className="text-base font-medium leading-6 "
                              >
                                Allow Withdrawal
                              </Label>
                              <Description className="text-sm ">
                                You can turn on and off withdrawals for users.
                              </Description>
                            </div>
                            <Switch
 
 
                              checked={withdrawal}
                              onChange={setWithdrawal}
                              className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
                            >
                              <span
                                aria-hidden="true"
                                className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                              />
                            </Switch>
                          </Field>
                          <Field
                            as="li"
                            className="flex items-center justify-between  "
                          >
                            <div className="flex flex-col">
                              <Label
                                as="p"
                                passive
                                className="text-base font-medium leading-6 "
                              >
                                Allow Deposite
                              </Label>
                              <Description className="text-base ">
                                You can turn on and off deposites for users.
                              </Description>
                            </div>
                            <Switch
                              checked={deposite}
                              onChange={setDeposite}
                              className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
                            >
                              <span
                                aria-hidden="true"
                                className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                              />
                            </Switch>
                          </Field>
                          <Field
                            as="li"
                            className="flex items-center justify-between  "
                          >
                            <div className="flex flex-col">
                              <Label
                                as="p"
                                passive
                                className="text-base font-medium leading-6 "
                              >
                                Allow ROI
                              </Label>
                              <Description className="text-base ">
                                You can turn on and off ROI for users.
                              </Description>
                            </div>
                            <Switch
                              checked={roi}
                              onChange={setRoi}
                              className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
                            >
                              <span
                                aria-hidden="true"
                                className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                              />
                            </Switch>
                          </Field>
                          <Field
                            as="li"
                            className="flex items-center justify-between "
                          >
                            <div className="flex flex-col">
                              <Label
                                as="p"
                                passive
                                className="text-base font-medium leading-6 "
                              >
                                Allow Support
                              </Label>
                              <Description className="text-base ">
                                You can turn on and off support for users.
                              </Description>
                            </div>
                            <Switch
                              checked={support}
                              onChange={setSupport}
                              className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
                            >
                              <span
                                aria-hidden="true"
                                className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                              />
                            </Switch>
                          </Field>
                          <Field
                            as="li"
                            className="flex items-center justify-between "
                          >
                            <div className="flex flex-col">
                              <Label
                                as="p"
                                passive
                                className="text-base font-medium leading-6 "
                              >
                                Allow Topup
                              </Label>
                              <Description className="text-base ">
                                You can turn on and off topup for users.
                              </Description>
                            </div>
                            <Switch
                              checked={topup}
                              onChange={setTopup}
                              className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
                            >
                              <span
                                aria-hidden="true"
                                className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                              />
                            </Switch>
                          </Field>
                        </div>
                      </div>
                    </ul>
 
                  </div>
                </div>

                <div className="pt-6 divide-y divide-gray-200">
                  <div className="flex justify-end gap-4 px-4 sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center px-6 py-2 text-base font-semibold text-white rounded-md shadow-sm bg-sky-700 hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center px-6 py-2 text-base font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 ring-1 ring-inset ring-gray-300 "
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
