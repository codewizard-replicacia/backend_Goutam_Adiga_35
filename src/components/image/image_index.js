import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BASE_URL, PATH_DOCUMENT } from "../../utils/constants";
import makeApiCall from "../../utils/makeApiCall";

const Image = ({ imageId, customStyles }) => {
  const [imageData, setImageData] = useState();

  const getImage = async (imageId) => {
    const res = await makeApiCall(`${BASE_URL}${PATH_DOCUMENT}(${imageId})/$value`);
    const data = await res.text();
    const finVal = data.split(',');
    setImageData(finVal[1]);
  };
  useEffect(() => {
    if (imageId) {
      getImage(imageId);
    }
  }, [imageId]);

  return imageData ? (
    <img
      alt={imageData}
      style={{ maxWidth: 200, ...customStyles }}
      src={`data:image/jpeg;base64,${imageData}`}
    />
  ) : (
    <img
    alt={'default'}
    style={{ maxWidth: 200, ...customStyles }}
    src={"../placeholder2.jpg"}
  />
  );
};

Image.propTypes = {
  imageId: PropTypes.string.isRequired,
};

export default Image;
