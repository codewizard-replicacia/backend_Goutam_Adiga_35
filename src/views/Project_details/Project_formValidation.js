Project_formValidation
$eType
$eTypeKeyName

export const validateForm = (formData, mode, imageData, setErrorData) => {
    const errors = {};
  
    formData.ProductProductType = parseInt(formData.ProductProductType, 10);
    formData.ProductPrice = parseFloat(formData.ProductPrice);
    formData.ProductSize = parseFloat(formData.ProductSize);
  
    if (isNaN(formData.ProductProductType) || !Number.isInteger(formData.ProductProductType)) {
      errors.ProductProductType = "Product Type must be a whole number";
    }
  
    if (isNaN(formData.ProductPrice) || formData.ProductPrice <= 0) {
      errors.ProductPrice = "Product Price must be a positive number";
    }
  
    if (isNaN(formData.ProductSize) || formData.ProductSize <= 0) {
      errors.ProductSize = "Product Size must be a positive number";
    }
  
    if (!formData.ProductName) {
      errors.ProductName = "Product Name is required";
    }

    if (!formData.ProductColor) {
    errors.ProductColor = "Product Color is required";
    } else if (!/^\D+$/.test(formData.ProductColor)) {
    errors.ProductColor = "Product Color should contain non-numeric characters";
    }
      
  
    if (mode === "create" && !imageData) {
      errors.ProductProductImage = "Image is required";
    }
  
    setErrorData(errors);
    return Object.keys(errors).length === 0;
  };
  