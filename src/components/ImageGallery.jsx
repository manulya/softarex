import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import like from "../img/like.svg";
import likeTrue from "../img/liketrue.svg";
import download from "../img/download.svg";
import { createClient } from "pexels";
const client = createClient(
  "563492ad6f917000010000014640aabb4e9d420cbe1c0df7daf4c2bf"
);

const ImageGalleryContainer = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
  gap: 30px;
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
`;
const Overlay = styled.div`
  width: 100%;
  height: 100%;
`;
const Button = styled.button`
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: transparent;
  border: none;
  border-radius: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 100;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;

  &.download-button {
    bottom: 15px;
    right: 15px;
    &:hover {
      filter: brightness(0.9);
    }
  }

  &.like-button {
    top: 15px;
    right: 15px;
    &:hover {
      filter: brightness(0.9);
    }
  }
  &.author-button {
    bottom: 15px;
    left: 15px;
    background-color: rgba(1,1,1,0);
    color: #ffffff;
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  &:hover {
    ${Image} {
      filter: brightness(0.7);
    }

    ${Overlay} {
      opacity: 1;
    }

    ${Button} {
      opacity: 1;
    }
  }
`;


const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

const ImageGallery = () => {
  const [column1Images, setColumn1Images] = useState([]);
  const [column2Images, setColumn2Images] = useState([]);
  const [column3Images, setColumn3Images] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [likes, setLikes] = useState({});

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `https://api.pexels.com/v1/curated?per_page=15&page=${page}`,
        {
          headers: {
            Authorization:
              "563492ad6f917000010000014640aabb4e9d420cbe1c0df7daf4c2bf",
          },
        }
      );
      const newImages = response.data.photos.map((photo) => ({
        id: photo.id,
        src: photo.src.large2x,
        photographer: photo.photographer,
        authorURL:photo.photographer_url,
      }));
      
      const savedLikes = JSON.parse(localStorage.getItem("likes")) || {};

      setLikes(savedLikes);

      const updatedImages = newImages.map((image) => {
        if (savedLikes[image.id]) {
          return { ...image, liked: true };
        } else {
          return image;
        }
      });

      const imagesByColumn = updatedImages.reduce(
        (acc, image, index) => {
          if (index % 3 === 0) {
            acc[0].push(image);
          } else if (index % 3 === 1) {
            acc[1].push(image);
          } else {
            acc[2].push(image);
          }
          return acc;
        },
        [[...column1Images], [...column2Images], [...column3Images]]
      );

      setColumn1Images(imagesByColumn[0]);
      setColumn2Images(imagesByColumn[1]);
      setColumn3Images(imagesByColumn[2]);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching images:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
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
  }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading,page]);

  const handlerClick = async (photoId) => {
    try {
      const photo = await client.photos.show({ id: photoId });
      const imageURL = photo.src.original;

      const response = await axios.get(imageURL, {
        responseType: "arraybuffer",
      });
      const blob = new Blob([response.data], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `image${photoId}.jpg`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Error downloading photo:", error);
    }
  };
 const handleLike = (photoId) => {
    setLikes((prevLikes) => {
      const updatedLikes = { ...prevLikes };
      if (updatedLikes[photoId]) {
        delete updatedLikes[photoId];
      } else {
        updatedLikes[photoId] = true;
      }
      localStorage.setItem("likes", JSON.stringify(updatedLikes));
      
      return updatedLikes;
    });
  };


  return (
    <div>
      <ImageGalleryContainer>
        <Column>
          {column1Images.map((image) => (
            <ImageWrapper key={image.id}>
              <Image src={image.src} alt={image.photographer} />
              <Overlay>
              <Button
                  className="author-button"
                >
                  <a href={image.authorURL} target="_blank" style={{textDecoration: "none", color:"white"}}>{image.photographer}</a>
                </Button>
                <Button
                  className="download-button"
                  onClick={() => handlerClick(image.id)}
                >
                  <img src={download} style={{ width: "20px" }}></img>
                </Button>
                <Button
                  className="like-button"
                  onClick={() => handleLike(image.id)}
                >
                  {!likes[image.id] ? (
                    <img src={like} style={{ width: "20px" }}></img>
                  ) : (
                    <img src={likeTrue} style={{ width: "20px" }}></img>
                  )}
                </Button>
              </Overlay>
            </ImageWrapper>
          ))}
        </Column>
        <Column>
          {column2Images.map((image) => (
            <ImageWrapper key={image.id}>
              <Image src={image.src} alt={image.photographer} />
              <Overlay>
              <Button
                  className="author-button"
                >
                  <a href={image.authorURL} target="_blank" style={{textDecoration: "none", color:"white"}}>{image.photographer}</a>
                </Button>
              <Button
                  className="download-button"
                  onClick={() => handlerClick(image.id)}
                >
                  <img src={download} style={{ width: "20px" }}></img>
                </Button>
                <Button
                  className="like-button"
                  onClick={() => handleLike(image.id)}
                >
                  {!likes[image.id]  ? (
                    <img src={like} style={{ width: "20px" }}></img>
                  ) : (
                    <img src={likeTrue} style={{ width: "20px" }}></img>
                  )}
                </Button>
              </Overlay>
            </ImageWrapper>
          ))}
        </Column>
        <Column>
          {column3Images.map((image) => (
            <ImageWrapper key={image.id}>
              <Image src={image.src} alt={image.photographer} />
              <Overlay>
              <Button
                  className="author-button"
                >
                  <a href={image.authorURL} target="_blank" style={{textDecoration: "none", color:"white"}}>{image.photographer}</a>
                </Button>
                <Button
                  className="download-button"
                  onClick={() => handlerClick(image.id)}
                >
                  <img src={download} style={{ width: "20px" }}></img>
                </Button>
                <Button
                  className="like-button"
                  onClick={() => handleLike(image.id)}
                >
                  {!likes[image.id]  ? (
                    <img src={like} alt="emptylike" style={{ width: "20px" }}></img>
                  ) : (
                    <img src={likeTrue} alt="fulllike" style={{ width: "20px" }}></img>
                  )}
                </Button>
              </Overlay>
            </ImageWrapper>
          ))}
        </Column>
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
