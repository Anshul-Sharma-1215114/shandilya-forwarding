function unsplash(id: string, w = 1600) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`;
}

export const IMAGES = {
  heroDelivery: unsplash("1616432043562-3671ea2e5242", 1800),
  heroShelves: unsplash("1601600576337-c1d8a0d1373c", 900),
  about: unsplash("1587293852726-70cdb56c2866", 1400),
  zealupBrand: "/images/products/ChatGPT_Image_Jul_24_2026_08_57_32_PM.png",
  parleAgroBrand: unsplash("1585861299373-491140ca920e", 1200),
  balajiBrand: "/images/products/balaji-home-page-png-500x500.png",
  distribution: unsplash("1736236560164-bc741c70bca5", 1400),
  processStrip: unsplash("1740914994162-0b2a49280aeb", 1600),
  contactBg: unsplash("1664382953403-fc1ac77073a0", 1600),
  gallery: [
    "/images/products/WhatsApp_Image_2026-07-24_at_8.52.19_PM.jpeg", // Zealup 20L jars, packed
    unsplash("1601602279590-989e63980bda", 1000), // warehouse worker boxes
    unsplash("1553413077-190dd305871c", 1000), // warehouse logistics
    unsplash("1601600576337-c1d8a0d1373c", 1000), // supermarket shelves
    unsplash("1620455800201-7f00aeef12ed", 1000), // delivery truck 2
    "/images/products/WhatsApp_Image_2026-07-24_at_8.52.19_PM_1.jpeg", // Zealup 20L jars, warehouse
    unsplash("1630803054940-db04c06d4a82", 1000), // supermarket shelves 2
    unsplash("1521791136064-7986c2920216", 1000), // partnership handshake
    unsplash("1604719312266-d57b1438d4bf", 1000), // supermarket shelves 3
    unsplash("1664382953403-fc1ac77073a0", 1000), // warehouse boxes 3
  ],
};
