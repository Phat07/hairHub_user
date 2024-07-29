import React, { useState } from "react";
import Header from "../components/Header";
import {
  List,
  Card,
  Button,
  Modal,
  Select,
  Empty,
  Rate,
  Pagination,
} from "antd";
import {
  HeartFilled,
  ExclamationCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import "../css/favorite.css";

const { Meta } = Card;
const { Option } = Select;
const { confirm } = Modal;

const initialSalons = [
  {
    name: "OMAR KINGSMEN BARBER ",
    address: "960 Lincoln Hwy, Schererville, 46375",
    rating: 5.0,
    reviews: 509,
    recommend: true,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "LEO KINGSMEN BARBER",
    address: "960 Lincoln Hwy, Schererville, 46375",
    rating: 4.9,
    reviews: 187,
    recommend: false,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "Sergio Mendoza KINGSMEN BARBER",
    address: "142 E US-30 Highway, Schererville, 46375",
    rating: 5.0,
    reviews: 176,
    recommend: false,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "OMAR KINGSMEN BARBER ",
    address: "960 Lincoln Hwy, Schererville, 46375",
    rating: 5.0,
    reviews: 509,
    recommend: true,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "LEO KINGSMEN BARBER",
    address: "960 Lincoln Hwy, Schererville, 46375",
    rating: 4.9,
    reviews: 187,
    recommend: false,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "Sergio Mendoza KINGSMEN BARBER",
    address: "142 E US-30 Highway, Schererville, 46375",
    rating: 5.0,
    reviews: 176,
    recommend: false,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "OMAR KINGSMEN BARBER ",
    address: "960 Lincoln Hwy, Schererville, 46375",
    rating: 5.0,
    reviews: 509,
    recommend: true,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "LEO KINGSMEN BARBER",
    address: "960 Lincoln Hwy, Schererville, 46375",
    rating: 4.9,
    reviews: 187,
    recommend: false,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "Sergio Mendoza KINGSMEN BARBER",
    address: "142 E US-30 Highway, Schererville, 46375",
    rating: 5.0,
    reviews: 176,
    recommend: false,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "OMAR KINGSMEN BARBER ",
    address: "960 Lincoln Hwy, Schererville, 46375",
    rating: 5.0,
    reviews: 509,
    recommend: true,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "LEO KINGSMEN BARBER",
    address: "960 Lincoln Hwy, Schererville, 46375",
    rating: 4.9,
    reviews: 187,
    recommend: false,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "Sergio Mendoza KINGSMEN BARBER",
    address: "142 E US-30 Highway, Schererville, 46375",
    rating: 5.0,
    reviews: 176,
    recommend: false,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "OMAR KINGSMEN BARBER ",
    address: "960 Lincoln Hwy, Schererville, 46375",
    rating: 5.0,
    reviews: 509,
    recommend: true,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "LEO KINGSMEN BARBER",
    address: "960 Lincoln Hwy, Schererville, 46375",
    rating: 4.9,
    reviews: 187,
    recommend: false,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "Sergio Mendoza KINGSMEN BARBER",
    address: "142 E US-30 Highway, Schererville, 46375",
    rating: 5.0,
    reviews: 176,
    recommend: false,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "OMAR KINGSMEN BARBER ",
    address: "960 Lincoln Hwy, Schererville, 46375",
    rating: 5.0,
    reviews: 509,
    recommend: true,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "LEO KINGSMEN BARBER",
    address: "960 Lincoln Hwy, Schererville, 46375",
    rating: 4.9,
    reviews: 187,
    recommend: false,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "Sergio Mendoza KINGSMEN BARBER",
    address: "142 E US-30 Highway, Schererville, 46375",
    rating: 5.0,
    reviews: 176,
    recommend: false,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "OMAR KINGSMEN BARBER ",
    address: "960 Lincoln Hwy, Schererville, 46375",
    rating: 5.0,
    reviews: 509,
    recommend: true,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "LEO KINGSMEN BARBER",
    address: "960 Lincoln Hwy, Schererville, 46375",
    rating: 4.9,
    reviews: 187,
    recommend: false,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "Sergio Mendoza KINGSMEN BARBER",
    address: "142 E US-30 Highway, Schererville, 46375",
    rating: 5.0,
    reviews: 176,
    recommend: false,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "OMAR KINGSMEN BARBER ",
    address: "960 Lincoln Hwy, Schererville, 46375",
    rating: 5.0,
    reviews: 509,
    recommend: true,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "LEO KINGSMEN BARBER",
    address: "960 Lincoln Hwy, Schererville, 46375",
    rating: 4.9,
    reviews: 187,
    recommend: false,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
  {
    name: "Sergio Mendoza KINGSMEN BARBER",
    address: "142 E US-30 Highway, Schererville, 46375",
    rating: 5.0,
    reviews: 176,
    recommend: false,
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/hinh-dep-5.jpg",
  },
];

function FavoriteList() {
  const [salons, setSalons] = useState(initialSalons);
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const handleRemoveFavorite = (name) => {
    setSalons(salons.filter((salon) => salon.name !== name));
  };

  const handleClearAll = () => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa hết danh sách yêu thích?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        if (salons.length > 0) {
          setSalons([]);
        } else {
          Modal.info({
            title: "Thông báo",
            content: "Không có salon nào để xóa.",
          });
        }
      },
    });
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    const sortedSalons = [...salons].sort((a, b) => {
      if (value === "A-Z") return a.name.localeCompare(b.name);
      if (value === "Z-A") return b.name.localeCompare(a.name);
      return 0;
    });
    setSalons(sortedSalons);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentSalons = salons.slice(startIndex, startIndex + pageSize);

  return (
    <div>
      <Header />
      <div
        style={{
          marginTop: "140px",
          marginLeft: "250px",
          marginRight: "250px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <Select
            defaultValue="SORT"
            style={{ width: 120 }}
            onChange={handleSortChange}
          >
            <Option value="SORT">SORT</Option>
            <Option value="A-Z">A-Z</Option>
            <Option value="Z-A">Z-A</Option>
          </Select>
          <Button type="primary" onClick={handleClearAll}>
            CLEAR ALL FAVORITES
          </Button>
        </div>
        {currentSalons.length > 0 ? (
          <>
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={currentSalons}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    hoverable
                    cover={<img alt={item.name} src={item.image} />}
                    actions={[
                      <HeartFilled
                        key="heart"
                        style={{ color: "#1890ff" }}
                        onClick={() => handleRemoveFavorite(item.name)}
                      />,
                    ]}
                  >
                    <Meta
                      title={item.name}
                      description={
                        <>
                          <Rate disabled defaultValue={item.rating} />
                          <p>{item.reviews} reviews</p>
                          <p>
                            <EnvironmentOutlined /> {item.address}
                          </p>
                        </>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={salons.length}
              onChange={handlePageChange}
              style={{ textAlign: "center", marginTop: "2rem" }}
            />
          </>
        ) : (
          <Empty description="Chưa có salon yêu thích" />
        )}
      </div>
    </div>
  );
}

export default FavoriteList;
