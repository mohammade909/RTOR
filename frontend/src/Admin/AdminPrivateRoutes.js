import { useSelector } from "react-redux";

import { Outlet, Navigate } from "react-router-dom";
export default function AdminPrivateRoute() {

  const { admin } = useSelector((state) => state.auth);

  return admin ? <Outlet /> : <Navigate to="/admin/login" />;
}
