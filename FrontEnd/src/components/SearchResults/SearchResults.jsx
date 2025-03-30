import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { products } from '../../data/ProductDataFE';
import Pagination from '../Pagination/Pagination';
import '../Product/Product.css';
import { remove as removeDiacritics } from 'diacritics';

const normalizeText = (text) => {
    return removeDiacritics(text)
        .toLowerCase()
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

const doesProductMatchSearchTerm = (productName, searchTerm) => {
    const normalizedProductName = normalizeText(productName);
    const normalizedSearchTerm = normalizeText(searchTerm);
    const searchKeywords = normalizedSearchTerm.split(' ');

    return searchKeywords.every(keyword => normalizedProductName.includes(keyword));
};

const SearchResults = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query') || '';

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const navigate = useNavigate();

    const filteredProducts = products.filter(product =>
        doesProductMatchSearchTerm(product.name, query)
    );

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDetail = (id) => {
        navigate(`/product/${id}`);
    };

    return (
        <div className="bg0 m-t-23 p-b-140">
            <div className="container">
                <h2>Search Results for "{query}"</h2>
                <div className="row isotope-grid">
                    {currentProducts.map((product) => (
                        <div key={product.id} className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item">
                            <div className="block2">
                                <div className="block2-pic hov-img0">
                                    <img src={product.img} alt={product.name} />
                                    <button
                                        onClick={() => handleDetail(product.id)}
                                        className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
                                    >
                                        Detail
                                    </button>
                                </div>
                                <div className="block2-txt flex-w flex-t p-t-14">
                                    <div className="block2-txt-child1 flex-col-l ">
                                        <a href={`/product/${product.id}`} className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6">
                                            {product.name}
                                        </a>
                                        <span className="stext-105 cl3">{product.price.toLocaleString()} VND</span>
                                    </div>
                                    <div className="block2-txt-child2 flex-r p-t-3">
                                        <a href="#" className="btn-addwish-b2 dis-block pos-relative js-addwish-b2">
                                            <img className="icon-heart1 dis-block trans-04" src="assets/images/icons/icon-heart-01.png" alt="ICON" />
                                            <img className="icon-heart2 dis-block trans-04 ab-t-l" src="assets/images/icons/icon-heart-02.png" alt="ICON" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default SearchResults;
