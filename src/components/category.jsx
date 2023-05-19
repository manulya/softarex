import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Dropdown, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { createClient } from 'pexels';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import like from "../img/like.svg";
import likeTrue from "../img/liketrue.svg";
import download from "../img/download.svg";
const client = createClient(
  "563492ad6f917000010000014640aabb4e9d420cbe1c0df7daf4c2bf"
);


const Category = () => {

  const [images, setImages] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(searchParams.get("query"));
  const [column1Images, setColumn1Images] = useState([]);
  const [column2Images, setColumn2Images] = useState([]);
  const [column3Images, setColumn3Images] = useState([]);
  const [likes, setLikes] = useState({});



  useEffect(() => {
    setQuery(searchParams.get("query"));
    setImages(() => []);
  }, [location.search, searchParams]);
 
  useEffect(() => {
    fetchImages();
  }, [page]);

  useEffect(() => {
    return () => {
      setImages(() => []);
    setPage(1);
    setLoading(true);
    setColumn1Images([]);
    setColumn2Images([]);
    setColumn3Images([]);
    fetchImages()
    };
    
  }, [query]);

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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, page, images]); 


  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${query}&per_page=15&page=${page}`,
        {
          headers: {
            Authorization: "563492ad6f917000010000014640aabb4e9d420cbe1c0df7daf4c2bf",
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
if(page===1){
  setImages((prevImages)=>prevImages)
  setImages(() => [updatedImages]);
}
else{
      setImages((prevImages) => [...prevImages, ...updatedImages]);
}

      setLoading(false);
      const imagesByColumn = updatedImages.reduce((acc, image, index) => {
        if (index % 3 === 0) {
          acc[0].push(image);
        } else if (index % 3 === 1) {
          acc[1].push(image);
        } else {
          acc[2].push(image);
        }
        return acc;
      }, [[...column1Images], [...column2Images], [...column3Images]]);

      setColumn1Images(imagesByColumn[0]);
      setColumn2Images(imagesByColumn[1]);
      setColumn3Images(imagesByColumn[2]);

    } catch (error) {
      console.log('Error fetching images:', error);
      setLoading(false);
    }
   
  };


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
      <Navbar scrolled={true} query={query} />
      <CategoryContainer>
        <Title>фото {query}</Title>
        <StyledDropdown variant="light">
          <StyledToggle variant="light" id="dropdown-basic">
            Фильтры
            <svg
              class="spacing_noMargin__Q_PsJ"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                id="filter_list-f2ecbc88f73bd1adcf5a04f89af6f1b9_Icon"
                d="M10.778,18.955h4.444V16.732H10.778ZM3,7V9.222H23V7Zm3.333,7.088H19.667V11.866H6.333Z"
                transform="translate(-1 -1)"
              ></path>
            </svg>
          </StyledToggle>
          <Dropdown.Menu style={{ zIndex: "2" }}>
            <Dropdown.Item>
              <Dropdown variant="light">
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  Все ориентации
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Все ориентации</Dropdown.Item>
                  <Dropdown.Item>Горизонтальная</Dropdown.Item>
                  <Dropdown.Item>Вертикальная</Dropdown.Item>
                  <Dropdown.Item>Квадратные изображения</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Dropdown.Item>

            <Dropdown.Item>
              <Dropdown variant="light">
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  Все размеры
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Все размеры</Dropdown.Item>
                  <Dropdown.Item>Большой</Dropdown.Item>
                  <Dropdown.Item>Средний</Dropdown.Item>
                  <Dropdown.Item>Маленький</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Dropdown.Item>
          </Dropdown.Menu>
        </StyledDropdown>
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
      </CategoryContainer>
    </div>
  );
}

export default Category;

const CategoryContainer = styled.div`
  padding-right: 30px;
  padding-left: 30px;
  margin: 120px 50px 0 40px;
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: 49px;
  line-height: 65px;
  letter-spacing: -0.02em;
  color: #2c343e;
  fill: #2c343e;
  border: none;
  outline: none;
  margin-top: 130px;
  margin-bottom: 0px;
`;
const StyledDropdown = styled(Dropdown)`
  position: absolute;
  right: 0%;
  margin-right: 100px;
`;

const StyledToggle = styled(Dropdown.Toggle)`
  background-color: white;

  color: black;
  border-color: black;
  &::after {
    display: none;
  }
  &:hover,
  &:focus,
  &:active,
  &.show {
    background-color: white;
    color: black;
    border-color: black;
  }
  svg {
    transition: transform 0.2s ease-in-out;
  }

  &.show svg {
    transform: rotate(180deg);
  }
`;

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