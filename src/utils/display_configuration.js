
$eType
display_configuration
ReOrderId
StockAlertmsg
Phnum
ProductName
ProductCategoryId
ProductName
Icon
PurchaseOrderId
Product
OrderUnits
UnitPrice
TotalPrice
Discount
PurchaseOrderDate
Invoice
TaxGSTAmount
ExchangeDate
ProductStoreId
ProductOwnerName
OwnerPh
Vendor
Category
ProductName
ProductUnitsPurchased
TotalUnitsPurchasedPrice
PricePerUnit
VendorAddress
VendorContact
DocId
FileType
FileName
ProductId
CategoryId
ProductName
InventoryId
Perishable
ExpirtyDate
PurchasedDate
Vendor
VendorContact
CurrentStockUnits
InStockunits
hi

export const productViewConfig = {
  Details: [
    {
      key: "Product_Id",
      value: "ID",
      type: "text",
      editable: false,
      required: true
    },
    {
      key: "ProductName",
      value: "Name",
      type: "text",
      editable: true,
      required: true,
    },
    {
      key: "ProductDescription",
      value: "Description",
      type: "text",
      editable: true,
    },
    {
        key: "ProductProductImage",
        value: "Image",
        type: "file",
        required: true,
        editable: true,
      },
  ],
  Other: [
    {
      key: "ProductPrice",
      value: "Price",
      type: "text",
      editable: true,
    },
    {
      key: "ProductSize",
      value: "Size",
      type: "text",
      editable: true,
    },
    {
      key: "ProductColor",
      value: "Color",
      type: "text",
      editable: true,
    },
    {
      key: "ReturnMerchandiseAuthNotRequired",
      value: "Return Merch Auth Not Required",
      type: "boolean",
      editable: true,
    },
    {
      key: "CreatedDate",
      value: "Created Date",
      editable: false,
    },
    {
      key: "LastModifiedDate",
      value: "Last Modified Date",
      editable: false,
    },
  ],
  Type: [
    {
      key: "ProductProductType",
      value: "Product Type",
      type: "lookup",
      editable: true,
      required: true
    },
  ],

};
