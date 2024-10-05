useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/api/stock/getAllStocksByDepartment/${departmentName}`, {
        headers: { token: accessToken }
      });

      const newData = response.data.result.flatMap((item, index) => {
        // Check if expiryArray exists and is an array before using it
        if (!Array.isArray(item.expiryArray)) {
          return [{
            ...item,
            id: index + 1,
            totalQuantity: 0,
            expiry: 'No expiry info',
            itemCode: item.product?.itemCode?.replace(item.product?.supplierName || '', '****') || 'ProductDeleted'
          }];
        }

        return item.expiryArray.map((expiryItem, expiryIndex) => ({
          ...item,
          id: `${index + 1}-${expiryIndex + 1}`, // Unique id for each row
          totalQuantity: expiryItem.quantity,
          expiry: expiryItem.expiry,
          itemCode: item.product?.itemCode?.replace(item.product?.supplierName || '', '****') || 'ProductDeleted'
        }));
      });

      setData(newData);
      sortData(newData); // Sorting newData by itemCode after setting the state
    } catch (error) {
      console.error('Error fetching Genetic stock data:', error);
    }
  };

  fetchData();
}, [url, accessToken]);
