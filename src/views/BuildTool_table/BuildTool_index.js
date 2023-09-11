
import { useState, useEffect, createRef } from "react";
import { useSnackbar } from "notistack";
import MuiTable from "../../components/table/table_index";
import { BASE_URL, PATH_BUILDTOOL } from "../../utils/constants";
import makeApiCall from "../../utils/makeApiCall";

function BuildToolTable() {

  const tableRef = createRef();
  const snackbar = useSnackbar();
  

  const columns = [
      { title: "Id", field: "Id" },
      { title: "Name", field: "Name" },
      { title: "Description", field: "Description" },
  ];
  
  const fetchData = async (query) => {
    return new Promise((resolve, reject) => {
      const { page, orderBy, orderDirection, search, pageSize } = query;
      const url = `${BASE_URL}${PATH_BUILDTOOL}`;
      let temp = url; // Initialize with the base URL
      let filterQuery = ""; // Initialize filter query as an empty string
  
      // Handle sorting
      if (orderBy) {
        temp += `?$orderby=${orderBy.field} ${orderDirection}`;
      }
  
      // Handle searching
      if (search) {
        filterQuery = `$filter=contains($screen.getSearchField().getName(), '${search}')`;
        temp += orderBy ? `&${filterQuery}` : `?${filterQuery}`;
      }
  
      // Handle pagination
      if (page > 0) {
        const skip = page * pageSize;
        temp += orderBy || search ? `&$skip=${skip}` : `?$skip=${skip}`;
      }
  
      const countUrl = search ? `${url}/$count?${filterQuery}` : `${BASE_URL}${PATH_BUILDTOOL}/$count`;
      let total = null;
  
      makeApiCall(countUrl)
        .then((res) => res.text())
        .then((e) => {
          total = parseInt(e, 10);
        })
        .then(() => makeApiCall(temp))
        .then((res) => res.json())
        .then(({ value }) => {
          return resolve({
            data: value,
            page: page,
            totalCount: total,
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return (
    <div className="product-container">
      {
      (
        <MuiTable
          tableRef={tableRef}
          title="$screen.getScreenName()"
          cols={columns}
          data={fetchData}
          size={5}
          
          onRowDelete={async (oldData) => {
            const resp = await makeApiCall(
              `${BASE_URL}${PATH_BUILDTOOL}(${oldData.${eTypeKeyName}})`,
              "DELETE"
            );
            if (resp.ok) {
              tableRef.current.onQueryChange();
              snackbar.enqueueSnackbar("Successfully deleted product", {
                variant: "success",
              });
            } else {
              const jsonData = await resp.json();
              snackbar.enqueueSnackbar(`Failed! - ${jsonData.message}`, {
                variant: "error",
              });
            }
          }}
        />
      )}
    </div>
  );
}

export default BuildToolTable;
