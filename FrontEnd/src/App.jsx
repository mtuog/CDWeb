import React from 'react';
import { createBrowserRouter, RouterProvider, Route, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/Store';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import AboutUs from './components/AboutUs/AboutUs';
import Home from './components/Home/Home';
import Product from './components/Product/Product';
import ProductDetail from './components/ProductDetail/ProductDetail';
import ShoppingCart from './components/ShoppingCart/ShoppingCart';
import Contact from './components/Contact/Contact';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import ChangePassword from './components/ChangePassword/ChangePassword';
import Profile from './components/Profile/Profile';
import SearchResults from './components/SearchResults/SearchResults';
import Camera from './components/Camera/Camera';
import CameraApp from './components/CameraApp/CameraApp';
import Payment from "./components/Payment/Payment";
import AdminLayout from './admin/layouts/AdminLayout';
import Dashboard from './admin/pages/dashboard/Dashboard';


const Layout = () => {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}

// Admin không cần header và footer của FrontEnd
const AdminRoute = () => {
    return <AdminLayout />;
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'home', element: <Home /> },
            { path: 'aboutus', element: <AboutUs /> },
            { path: 'product', element: <Product /> },
            { path: 'product/:id', element: <ProductDetail /> },
            { path: 'shoppingCart', element: <ShoppingCart /> },
            { path: 'contact', element: <Contact /> },
            { path: 'register', element: <Register /> },
            { path: 'login', element: <Login /> },
            { path: 'changePassword', element: <ChangePassword /> },
            { path: 'profile/:id', element: <Profile /> },
            { path: 'search', element: <SearchResults /> }, 
            { path: 'camera', element: <Camera /> }, 
            { path: 'video', element: <CameraApp /> }, 
            { path: 'payment', element: <Payment/> },
        ],
    },
    {
        path: '/admin',
        element: <AdminRoute />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'dashboard', element: <Dashboard /> },
            // Thêm các routes cho admin khác ở đây
        ],
    },
]);

function App() {
    return (
        <Provider store={store}>
            <div className="App">
                <RouterProvider router={router} />
            </div>
        </Provider>
    );
}

export default App;
