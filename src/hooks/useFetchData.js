export const fetchData = async ({url, headerAuthString}) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: headerAuthString,
          "Content-Type": "application/json",
        },
      });

      const dataKirby = await response.json();
      return dataKirby;
    } catch (error) {
      
    }
  };

export const fetchAllDataf = async ({urls, headerAuthString}) => {
    const promises = urls.map((url) => fetchData({url, headerAuthString}));
    try {
      return await Promise.all(promises);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };