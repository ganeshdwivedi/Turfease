const handleOpenMap = (latitude: number, longitude: number) => {
  const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
  window.open(url, "_blank");
};
export default handleOpenMap;
