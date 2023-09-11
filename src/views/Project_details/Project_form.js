Project_form
$eType
$eTypeKeyName

import { Box, Button, Checkbox, Divider, Grid, makeStyles, Table, TableBody, TableCell, TableRow, TextField, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { BASE_URL, PATH_PRODUCT, PATH_PRODUCT_TYPE, PATH_DOCUMENT } from "../../utils/constants";
import makeApiCall from "../../utils/makeApiCall";
import { productViewConfig } from "../../utils/display_configuration";
import moment from "moment";
import MuiSelect from "../../components/select/select_index";
import { useSnackbar } from "notistack";
import { validateForm } from "./product_formValidation"

const useStyles = makeStyles((theme) => ({
  table: {
    margin: "0 auto",
    width: "90%",
  },
  titleCell: {
    width: "35%",
    textAlign: "right",
    borderBottom: "none",
  },
  valueCell: {
    textAlign: "left",
    borderBottom: "none",
  },
  link: {
    color: theme.palette.secondary.main,
    textDecoration: "underline",
    cursor: "pointer",
  },
}));

const ProductForm = ({ mode = "create" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const styles = useStyles();
  const [productTypes, setProductTypes] = useState([]);
  const [formData, setFormData] = useState({});
  const [imageData, setImageData] = useState();
  const [fileName, setFileName] = useState();
  const [fileType, setFileType] = useState();
  const [errorData, setErrorData] = useState({});

  useEffect(() => {
    const fetchProductTypes = async () => {
      const typesResponse = await makeApiCall(
        `${BASE_URL}${PATH_PRODUCT_TYPE}`
      );
      const jsonResp = await typesResponse.json();
      setProductTypes(jsonResp.value);
    };
    fetchProductTypes();
  }, []);

  useEffect(() => {
    if (id && mode === "edit") {
      const fetchProductById = async () => {
        const productResponse = await makeApiCall(
          `${BASE_URL}${PATH_PRODUCT}(${id})`
        );
        const jsonResp = await productResponse.json();
        setFormData(jsonResp);
      };
      fetchProductById();
    }
  }, [id, mode]);
  
  const handleChange = (key, value) => {
    setFormData({ ...formData, ...{ [key]: value } });
  };

  const handleImage = async (e) => {
    if (e.target.reportValidity()) {
      const file = e.target.files[0];
      const reader = new FileReader();
      const fileName = file.name;
      const nameParts = fileName.split(".");
      setFileName(nameParts[0]);
      setFileType(nameParts[1]);

      reader.onload = () => { 
        const base64Image = reader.result;
        setImageData(base64Image);
      };

      reader.readAsDataURL(file);
    }
  }

  // const validateForm = () => {
  //   const errors = {};
  //   let errorList = [];
  //   formData.ProductProductType = parseInt(formData.ProductProductType, 10);
  //   formData.ProductPrice = parseFloat(formData.ProductPrice);
  //   formData.ProductSize = parseFloat(formData.ProductSize);

  //   if (!formData.ProductName) {
  //     errors.productName = "Product Name is required";
  //     errorList.push("Product Name is required");
  //   }
  //   if (mode === "create" && !imageData) {
  //     errors.image = "Image is required";
  //     errorList.push("Product Image is required");
  //   }
  //   if (errorList.length > 0) {
  //     snackbar.enqueueSnackbar(`Failed! - ${errorList.join(", ")}`, {
  //       variant: "error",
  //     });
  //   }
  //   setErrorData(errors);
  //   return Object.keys(errors).length === 0;
  // };

  const submitForm = async () => {
    if (validateForm(formData, mode, imageData, setErrorData)) {
        const { ProductType, ProductProductImage, ...otherData } = formData;
        if (mode === "create") {
          const imageResp = await makeApiCall(
            `${BASE_URL}${PATH_DOCUMENT}`,
            "POST",
            imageData,
            {
              FileType: fileName,
              FileName: fileType
            },
            true
          );
          let imgResJson = await imageResp.json();
          if (imageResp.ok) {
            const resp = await makeApiCall(
              `${BASE_URL}${PATH_PRODUCT}`,
              "POST",
              JSON.stringify({
                ...otherData,
                ProductProductImage: imgResJson.Doc_Id,
              })
            );
            if (resp.ok) {
              snackbar.enqueueSnackbar("Successfully created product", {
                variant: "success",
              });
              navigate({pathname:'/products'});
            } else {
              const jsonData = await resp.json();
              snackbar.enqueueSnackbar(`Failed! - ${jsonData.message}`, {
                variant: "error",
              });
            }
          }
        } else if (mode === "edit") {
        const {
          ProductName,
          ProductDescription,
          ProductColor,
          ProductSize,
          ProductPrice,
          ProductProductImage,
          ProductProductType,
          ReturnMerchandiseAuthNotRequired
        } = formData;
        let imgResJson = "";
        if (imageData) {
          const imageResp = await makeApiCall(
            `${BASE_URL}${PATH_DOCUMENT}`,
            "POST",
            imageData,
            {
              FileType: fileName,
              FileName: fileType
            },
            true
          );
          imgResJson = await imageResp.json();
        }
        let data = {
          ProductName,
          ProductDescription,
          ProductColor,
          ProductSize,
          ProductPrice,
          ProductProductImage,
          ReturnMerchandiseAuthNotRequired,
          ProductProductType
        };
        if (imgResJson) {
          data = { ...data, ...{ ProductProductImage: [imgResJson.Doc_Id] } };
        }
        data.ProductProductImage = imgResJson.Doc_Id;
        const resp = await makeApiCall(
          `${BASE_URL}${PATH_PRODUCT}(${formData.Product_Id})`,
          "PATCH",
          JSON.stringify(data)
        );
        if (resp.ok) {
          snackbar.enqueueSnackbar("Successfully updated product", {
            variant: "success",
          });
          navigate({pathname:'/products'});
        } else {
          const jsonData = await resp.json();
          snackbar.enqueueSnackbar(`Failed! - ${jsonData.message}`, {
            variant: "error",
          });
        }
      }
    }
  };

  return (
    <Box padding={2}>
      <Grid>
        <Grid item lg={12} xs={12}>
          <Box display="flex" justifyContent="space-between">
            <Typography className="page-heading" variant="h5">
              {mode === "create" ? "Create Product" : "Edit Product"}
            </Typography>
            <div className="action-buttons">
              <Button
                size="small"
                variant="contained"
                color="primary"
                className="margin-right"
                onClick={submitForm}
              >
                Save
              </Button>
              &nbsp;
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => navigate({pathname:'/products'})}
              >
                Cancel
              </Button>
            </div>
          </Box>
        </Grid>
        <Divider />
        <Box marginTop={2} className="form-container">
          <Grid container item lg={12} xs={12}>
            {Object.keys(productViewConfig).map((config, ind) => (
              <>
                <Grid item lg={5} md={5} xs={12}>
                  <Box marginTop={1}>
                    <Typography variant="h6">{config}</Typography>
                    <Table size="small" className={styles.table}>
                      <TableBody>
                        {productViewConfig[config].map(
                          ({ editable, key, value, type, required }) =>
                            (mode === "edit" || editable) && (
                              <TableRow key={key} className="responsive-table-row">
                                <TableCell className={[styles.titleCell, 'row-label'].join(' ')}>
                                  <Typography variant="body1">
                                    {value}
                                    {required ? "*" : ""}:
                                  </Typography>
                                </TableCell>
                                <TableCell className={[styles.valueCell, 'row-value'].join(' ')}>
                                  {key === "Product_Id" ? (
                                    <Typography variant="body1">
                                      {formData[key]}
                                    </Typography>
                                  ) : key === "ProductProductType" ? (
                                    <MuiSelect
                                      value={
                                        formData[key]
                                          ? productTypes.find(
                                              (product) =>
                                                product.ProductTypeCode ===
                                                formData[key]
                                            )
                                          : ""
                                      }
                                      options={productTypes}
                                      error={errorData[key]}
                                      helperText={errorData[key]}
                                      valueKey="ProductTypeDescription"
                                      handleChange={(e) => 
                                        handleChange(key, e.target.value.ProductTypeCode)
                                      }
                                    />
                                  ) : key === "CreatedDate" ||
                                    key === "LastModifiedDate" ? (
                                    <Typography variant="body1">
                                      {formData[key] !== null &&
                                        moment(formData[key]).format(
                                          "DD-MMMM-YYYY HH:mm:ss A"
                                        )}
                                    </Typography>
                                  ) : type === "boolean" ? (
                                    <Checkbox
                                      checked={formData[key] || false}
                                      onChange={(e) =>
                                        handleChange(key, e.target.checked)
                                      }
                                    />
                                  ) : key === "ProductProductImage" ? (
                                      <TextField
                                        name={key}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        type={type}
                                        error={errorData[key]}
                                        helperText={errorData[key]}
                                        inputProps={{ accept: "image/*" }}
                                        onChange={(e) => {
                                          handleImage(e);
                                          handleChange(key, e.target.value)
                                        }}
                                      />
                                  ) : (<>

                                    <TextField
                                      name={key}
                                      fullWidth
                                      className="text-field-custom"
                                      variant="outlined"
                                      size="small"
                                      type={type}
                                      error={errorData[key]}
                                      helperText={errorData[key]}
                                      value={formData[key] || ""}
                                      onChange={(e) => {
                                        if (e.target.reportValidity()) {
                                          handleChange(key, e.target.value);
                                        }
                                      }}
                                    />
                                  </>
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                </Grid>
                <Grid item lg={1} md={1} xs={false} />
              </>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
};

export const EditProductForm = () => <ProductForm mode="edit" />;
export const CreateProductForm = () => <ProductForm mode="create" />;
