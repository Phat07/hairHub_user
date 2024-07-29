import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { Avatar, Divider, List, Skeleton } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
function BarberPage(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch(
      "https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo"
    )
      .then((res) => res.json())
      .then((body) => {
        setData([...data, ...body.results]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  console.log("data", data);
  useEffect(() => {
    loadMoreData();
    window.scrollTo({ top: 3000, behavior: "smooth" });
  }, []);
  return (
    <div>
      <section
        className="section hero has-before has-bg-image"
        id="home"
        aria-label="home"
        style={{
          backgroundImage: 'url("./assets/images/hero-banner.jpg")',
        }}
      >
        <motion.div
          variants={{
            hidden: { y: "-100vh", opacity: 0 },
            visible: {
              y: "-1px",
              opacity: 1,
              transition: {
                delay: 0.5,
                type: "spring",
                stiffness: 30,
              },
            },
          }}
          initial="hidden"
          animate="visible"
          className="container"
        >
          <h1 className="h1 hero-title">Barbers &amp; Hair Cutting</h1>
          <p className="hero-text">
            Sit amet consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua suspendisse ultrices
            gravida
          </p>
          <a href="#" className="btn has-before">
            <span className="span">Explore Our Services</span>
            <ion-icon name="arrow-forward" aria-hidden="true" />
          </a>
        </motion.div>
      </section>
      <motion.div
        className="mt-5"
        variants={{
          hidden: { y: "-100vh", opacity: 0 },
          visible: {
            y: "-1px",
            opacity: 1,
            transition: {
              delay: 0.5,
              type: "spring",
              stiffness: 50,
            },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        <div className="pl-20">
          <h1 className="font-black text-5xl">title</h1>
          <p className="text-xl mt-2">What affects the search results?</p>
          <p>filter ở đây để hiển thị các nội dung tìm kiếm</p>
          <p>map views gắn api để hiển thị các baber ra</p>
        </div>
      </motion.div>
      <div
        id="scrollableDiv"
        style={{
          height: 600,
          overflow: "auto",
          padding: "0 16px",
          border: "1px solid rgba(140, 140, 140, 0.35)",
        }}
      >
        <InfiniteScroll
          dataLength={data.length}
          next={loadMoreData}
          hasMore={data.length < 50}
          loader={
            <Skeleton
              avatar
              paragraph={{
                rows: 1,
              }}
              active
            />
          }
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={data}
            renderItem={(item) => (
              <List.Item key={item.email}>
                <List.Item.Meta
                  avatar={<Avatar src={item.picture.large} />}
                  title={<a href="https://ant.design">{item.name.last}</a>}
                  description={item.email}
                  // style={{width:"50px"}}
                />
                <div style={{ width: "600px" }}>
                  <div className="flex justify-between">
                    <p>địa chỉ</p>
                    <p>Book</p>
                  </div>
                  <p>cắt tóc đơn</p>
                  <p>cạo râu, sale off</p>
                  <p>cắt tóc, cạo râu</p>
                </div>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default BarberPage;
