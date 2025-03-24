// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({ name: 'Contients' })
}

export const fetchDataKirbySlugs = async (endpoint) => {
  const authEmail = process.env.KIRBY_USERNAME;
  const authPassword = process.env.KIRBY_PASSWORD;


  const encodedAuthString = Buffer.from(`${authEmail}:${authPassword}`).toString("base64");
  const headerAuthString = `Basic ${encodedAuthString}`;
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: headerAuthString,
        "Content-Type": "application/json",
      },
    });

    const dataKirby = await response.json();
    
    const urls = dataKirby.result.children.map((value) => value)
    return urls;
  } catch (error) {
    
  }
} 