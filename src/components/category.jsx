import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Dropdown, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { createClient } from "pexels";
import { useLocation } from "react-router-dom";
import axios from "axios";
import like from "../img/like.svg";
import likeTrue from "../img/liketrue.svg";
import download from "../img/download.svg";
const client = createClient("563492ad6f917000010000014640aabb4e9d420cbe1c0df7daf4c2bf");
 

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
  const [orientation, setOrietation] = useState('Orientation')
  const [size, setSize] = useState("Size")


   const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1 &&
        !loading
      ) {
        setLoading(true);
        setPage((prevPage) => prevPage + 1);
      }
    };

    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  useEffect(() => {
  const fetchImages = async () => {
    try {
      const orientationParam = orientation !== 'Orientation' ? `&orientation=${orientation.toLowerCase()}` : '';
      const sizeParam = size !== 'Size' ? `&size=${size.toLowerCase()}` : '';

      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${query}&per_page=15&page=${page}${orientationParam}${sizeParam}`,
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
    if (updatedImages && updatedImages.length > 0) {
      console.log(page)
      if (query && page===1) {
        setPage(1);
        setImages(updatedImages);
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
        }, [[], [], []]);
        setColumn1Images(imagesByColumn[0]);
        setColumn2Images(imagesByColumn[1]);
        setColumn3Images(imagesByColumn[2]);
      } else if (page>1){
        setImages((prevImages) => [...prevImages, ...updatedImages]);
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
      }
      
    }

    } catch (error) {
      console.log('Error fetching images:', error);
      setLoading(false);
    }
   
  };
  if (query!==searchParams.get("query")) {
    setColumn1Images([]);
    setColumn2Images([]);
    setColumn3Images([]);
    setQuery(searchParams.get("query"));
  }

  fetchImages()

}, [query, page, searchParams]);

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
        <DropdownContainer>
        <Dropdown>
          <Dropdown.Toggle variant="light" id="dropdown-basic" >
           {orientation}
          </Dropdown.Toggle>
          <Dropdown.Menu>
          <Dropdown.Item onClick={()=>setOrietation('all orienations')} >all orienations</Dropdown.Item>
            <Dropdown.Item onClick={()=>setOrietation('landscape')} >landscape</Dropdown.Item>
            <Dropdown.Item onClick={()=>setOrietation('portrait')} >portrait</Dropdown.Item>
            <Dropdown.Item onClick={()=>setOrietation('square')}>square</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle variant="light" id="dropdown-basic">
            {size}
          </Dropdown.Toggle>
          <Dropdown.Menu>
          <Dropdown.Item onClick={()=>setSize('all sizes')}>all sizes</Dropdown.Item>
          <Dropdown.Item onClick={()=>setSize('large')}>large</Dropdown.Item>
            <Dropdown.Item onClick={()=>setSize('medium')}>medium</Dropdown.Item>
            <Dropdown.Item onClick={()=>setSize('small')}>small</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        </DropdownContainer>
        <ImageGalleryContainer>
          <Column>
            {column1Images.map((image) => (
              <ImageWrapper key={image.id}>
                <Image src={image.src} alt={image.photographer} />
                <Overlay>
                  <Button className="author-button">
                    <a
                      href={image.authorURL}
                      target="_blank"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      {image.photographer}
                    </a>
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
                  <Button className="author-button">
                    <a
                      href={image.authorURL}
                      target="_blank"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      {image.photographer}
                    </a>
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
            {column3Images.map((image) => (
              <ImageWrapper key={image.id}>
                <Image src={image.src} alt={image.photographer} />
                <Overlay>
                  <Button className="author-button">
                    <a
                      href={image.authorURL}
                      target="_blank"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      {image.photographer}
                    </a>
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
                      <img
                        src={like}
                        alt="emptylike"
                        style={{ width: "20px" }}
                      ></img>
                    ) : (
                      <img
                        src={likeTrue}
                        alt="fulllike"
                        style={{ width: "20px" }}
                      ></img>
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
};

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
  position: relative;
  z-index: 2;
`;

const StyledToggle = styled(Dropdown.Toggle)`
  background-color: white;

  color: black;
  border-color: black;
  &::after {
    display: none;
  }
  &:hover {
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
const StyledInnerDropdown = styled(Dropdown)`
  position: static !important;
`;

const ImageGalleryContainer = styled.div`
  margin-top: 100px;
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
    background-color: rgba(1, 1, 1, 0);
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
const DropdownContainer = styled.div`
  display: flex;
  position:absolute;
  right:5%;
`