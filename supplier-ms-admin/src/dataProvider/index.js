import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

import buildGraphQLProvider from "@tsunadon/ra-data-prisma";

/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.rawFile);

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const defaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};
const link = new HttpLink({
  // uri: "https://petgo-erp-api.tsunadon.com/",
  uri: "http://localhost:4000/",
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions,
});

export const apolloClient = new ApolloClient(client);

export const getDataProvider = async () => {
  try {
    const provider = await buildGraphQLProvider({ client: apolloClient });
    return (fetchType, resource, params) => {
      if (
        resource !== "Product" ||
        !params.data ||
        !params.data.images ||
        params.data.images.length === 0
      ) {
        return provider(fetchType, resource, params);
      }

      if (fetchType === "UPDATE") {
        delete params.data.imagesIds;
        /**
         * For posts update only, convert uploaded image in base 64 and attach it to
         * the `picture` sent property, with `src` and `title` attributes.
         */
        // Freshly dropped pictures are File objects and must be converted to base64 strings
        const newPictures = params.data.images.filter(
          (p) => p.rawFile instanceof File
        );
        const formerPictures = params.data.images.filter(
          (p) => !(p.rawFile instanceof File)
        );

        return Promise.all(newPictures.map(convertFileToBase64))
          .then((base64Pictures) =>
            base64Pictures.map((picture64) => ({
              src: picture64,
              title: `${params.data.name} (${params.data.code})`,
            }))
          )
          .then((transformedNewPictures) =>
            provider("UPDATE", resource, {
              ...params,
              data: {
                ...params.data,
                images: [...formerPictures, ...transformedNewPictures],
              },
            })
          );
      } else if (fetchType === "CREATE") {
        // Freshly dropped pictures are File objects and must be converted to base64 strings
        const newPictures = params.data.images.filter(
          (p) => p.rawFile instanceof File
        );

        return Promise.all(newPictures.map(convertFileToBase64))
          .then((base64Pictures) =>
            base64Pictures.map((picture64) => ({
              src: picture64,
              title: `${params.data.name} (${params.data.code})`,
            }))
          )
          .then((transformedNewPictures) =>
            provider("CREATE", resource, {
              ...params,
              data: {
                ...params.data,
                images: transformedNewPictures,
              },
            })
          );
      } else {
        return provider(fetchType, resource, params);
      }
    };
  } catch (e) {
    console.error(e.message);
  }
};
