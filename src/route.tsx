/** @format */

import { createBrowserRouter } from "react-router-dom";
import {
  Bayes,
  Classification,
  Cluster,
  FrequentAndAssociation,
  HomePage,
  RawData,
  Preprocess,
} from "./page";
import { DefaultLayout } from "./component";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <DefaultLayout></DefaultLayout>
      </>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/preprocess",
        element: <Preprocess></Preprocess>,
      },
      {
        path: "/cluster",
        element: <Cluster />,
      },
      {
        path: "/bayes",
        element: <Bayes />,
      },
      {
        path: "/classification",
        element: <Classification />,
      },
      {
        path: "/frequentandassociate",
        element: <FrequentAndAssociation />,
      },
      {
        path: "/rawdata",
        element: <RawData />,
      },
    ],
  },
]);

export default router;
