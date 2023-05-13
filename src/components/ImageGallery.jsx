import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';

const ImageGalleryContainer = styled.div`
  margin-top: 50px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(100);

  


useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`https://api.pexels.com/v1/curated?per_page=15&page=${page}`, {
          headers: {
            Authorization: '563492ad6f917000010000014640aabb4e9d420cbe1c0df7daf4c2bf',
          },
        });
        const newImages = response.data.photos.map((photo) => ({
          id: photo.id,
          src: photo.src.large2x,
          photographer: photo.photographer,
        }));
        setImages((prevImages) => [...prevImages, ...newImages]);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching images:', error);
        setLoading(false);
      }
    };

  fetchImages();
}, [page]);
useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500 &&
        !loading
      ) {
        setLoading(true);
        setPage((prevPage) => prevPage + 1);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <div>
      <ImageGalleryContainer>
        {images.map((image) => (
          <Image key={image.id} src={image.src} alt={image.photographer} />
        ))}
      </ImageGalleryContainer>
      {loading && (
        <LoadingIndicator>
          <Spinner animation="border" role="status" />
        </LoadingIndicator>
      )}
    </div>
  );
};

export default ImageGallery;
