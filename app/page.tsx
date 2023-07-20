"use client";
import { fuels, yearsOfProduction } from "@/Constants";
import { HomeProps } from "@/Types";
import { CarCard, CustomFilters, Hero, SearchBar } from "@/components";
import ShowMore from "@/components/ShowMore";
import { useEffect, useState } from "react";
import { FetchCars } from "@/utils";
import Image from "next/image";

export default function Home({ searchParams }: HomeProps) {
  // const allCars = await FetchCars({
  //   manufacturer: searchParams.manufacturer || "",
  //   year: searchParams.year || 2000,
  //   fuel: searchParams.fuel || "",
  //   limit: searchParams.limit || 10,
  //   model: searchParams.model || "",
  // });
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(false);
  // search states
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  // filter states
  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState("2022");
  // pagination states
  const [limit, setLimit] = useState(10);

  const getCars = async () => {
    setLoading(true);
    try {
      const result = await FetchCars({
        manufacturer: manufacturer || "",
        year: year || "2022",
        fuel: fuel || "",
        limit: limit || 10,
        model: model || "",
      });
      console.log("result", result);
      setAllCars(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCars();
  }, [fuel, year, limit, manufacturer, model]);
  const isEmpty = !Array?.isArray(allCars) || allCars?.length < 1 || !allCars;

  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore out cars you might like</p>
        </div>

        <div className="home filters">
          <SearchBar setManufacturer={setManufacturer} setModel={setModel} />
          <div className="home__filter-container">
            <CustomFilters title="fuel" options={fuels} setFilter={setFuel} />
            <CustomFilters
              title="year"
              options={yearsOfProduction}
              setFilter={setYear}
            />
          </div>
        </div>

        {allCars?.length > 0 ? (
          <section>
            <div className="home__cars-wrapper">
              {allCars?.map((car) => (
                <CarCard car={car} />
              ))}
            </div>
            {loading && (
              <div className="mt-16 w-full flex-center">
                <Image
                  src="/car.svg"
                  alt="loader"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
            )}
            <ShowMore
              pageNumber={(limit) / 10}
              isNext={(limit  ) > allCars.length}
              setLimit = {setLimit}
            />
          </section>
        ) : (
          <div className="home__error-container">
            <h1 className="text-black text-xl font-bold">Oops, No result!</h1>
          </div>
        )}
      </div>
    </main>
  );
}
