import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  Select,
  message,
  Flex,
  Typography,
} from "antd";
import { data } from "autoprefixer";
import moment from "moment";
import {
  DeleteOutlined,
  DollarCircleOutlined,
  EditOutlined,
  LineOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "../css/manageVoucher.css";
import { voucherServices } from "../services/voucherServices";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import German locale
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { actGetVoucherBySalonId } from "../store/manageVoucher/action";
import "../css/Salonform.css";

function ManageVoucher(props) {
  const { id } = useParams(); //salonId
  const [form] = Form.useForm();
  dayjs.locale("vi");
  const formattedDate = "DD/MM/YYYY";
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND", // Replace 'USD' with your desired currency code
      // minimumFractionDigits: 5, // Adjust decimal places as needed
    }).format(value);
  };
  const [currencyValue, setCurrencyValue] = useState(100000);
  const [currencyValueUpdate, setCurrencyValueUpdate] = useState(null);
  const voucherList = useSelector(
    (state) => state.SALONVOUCHERS.getVoucherBySalonId
  );
  const totalPages = useSelector((state) => state.SALONVOUCHERS.totalPages);
  console.log("totalPages", totalPages);
  console.log("voucher", voucherList);

  const formatDiscount = (value) => {
    const result = value * 100;
    const resultPercent = result + "%";
    return resultPercent;
  };
  const currentDate = dayjs();

  //----------------------------------------------------------------

  const [status, setStatus] = useState(false);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [voucherUpdate, setVoucherUpdate] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    size: 5, // Số item trên mỗi trang
    total: 0, // Tổng số items
  });
  const dispatch = useDispatch();

  const handleSearch = () => {
    // Lọc dữ liệu dựa trên searchTerm
    const filteredData = voucherList?.filter(
      (item) =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.minimumOrderAmount.toString().includes(searchTerm) ||
        item.discountPercentage.toString().includes(searchTerm)
    );

    // Cập nhật dữ liệu hiển thị trên bảng
    setData(filteredData);
  };
  console.log(id, "SalonId");
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await voucherServices.getVoucherBySalonId(
        //   pagination.page,
        //   pagination.size,
        //   id
        // );
        dispatch(actGetVoucherBySalonId(pagination.page, pagination.size, id));
        // console.log("res", response.data);
        // setData(response.data.items);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [id, pagination.page, pagination.size, status]);
  useEffect(() => {
    setPagination({
      ...pagination,
      total: totalPages,
    });
  }, [voucherList, totalPages]);
  //----------------------------------------------------------------

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const reloadData = () => {
    setStatus(!status);
    console.log(status);
  };
  const onFinish = (values) => {
    console.log("Voucher Values", values);
    const { description, minimumOrderAmount, discountPercentage, expiryDate } =
      values;
    const configDiscountPercentage = discountPercentage / 100;

    const configExpiryDate = () => {
      // const newDate = new Date();
      const expiryDate1 = expiryDate.toDate();
      const newExpiryDate = expiryDate1.getDate() + 1;
      expiryDate1.setDate(newExpiryDate);
      return expiryDate1;
    };
    const configCurrentDate = () => {
      const currentDate1 = currentDate.toDate();
      const newCurrentDate = currentDate1.getDate() + 1;
      currentDate1.setDate(newCurrentDate);
      return currentDate1;
    };
    console.log(configExpiryDate(), "config ExpiryDate"); //config + 1 day :v, because New Date get system timezone so it deducted 1 day compare to my timezone
    console.log(configCurrentDate(), "config CurrentDate"); //config + 1 day :v

    const formVoucherData = {
      salonInformationId: id, //salonInformationId
      description: description,
      minimumOrderAmount: minimumOrderAmount,
      discountPercentage: configDiscountPercentage,
      expiryDate: configExpiryDate(), //convert dayjs to new Date and plus 1 day :v
      createdDate: configCurrentDate(), //config dayjs to new Date and plus 1 day :v
      modifiedDate: null,
      isSystemCreated: false,
      isActive: true,
    };
    voucherServices
      .createNewVoucher(formVoucherData)
      .then((res) => {
        console.log(formVoucherData);
        message.success("Voucher is created!");
        console.log(res.data, "Voucher is created");
        setStatus(!status);
        setIsModalVisible(!isModalVisible);
      })
      .catch((err) => console.log(err, "errors"));

    form.resetFields();
  };
  //-----------------------------------------------------------

  const { Option } = Select;

  const handleSortChange = (value) => {
    let sortedData = [...data]; // Giả sử 'data' là state lưu trữ danh sách voucher

    switch (value) {
      case "newest":
        sortedData.sort((a, b) =>
          moment(b.createdDate).diff(moment(a.createdDate))
        );
        break;
      case "oldest":
        sortedData.sort((a, b) =>
          moment(a.createdDate).diff(moment(b.createdDate))
        );
        break;
      case "ascending":
        sortedData.sort((a, b) => a.discountPercentage - b.discountPercentage);
        break;
      case "descending":
        sortedData.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      case "longest":
        sortedData.sort(
          (a, b) => new Date(b.expiryDate) - new Date(a.expiryDate)
        );
        break;
      case "expiring":
        sortedData.sort(
          (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
        );
        break;
      default:
        break;
    }

    setData(sortedData); // Cập nhật lại state 'data' với dữ liệu đã được sắp xếp
  };

  //-----------------------------------------------------------
  const handleDelete = (voucher) => {
    console.log(voucher.id);
    voucherServices
      .deleteVoucherById(voucher.id)
      .then((res) => {
        console.log(res, "res");
        setStatus(!status);
        message.success(`Delete ${voucher.description} voucher sucessfully!`);
      })
      .catch((err) => console.log(err, "errors"));
    // Thêm logic xóa voucher ở đây (ví dụ: call API)
  };

  const handleUpdate = (voucher) => {
    console.log("Update voucher", voucher);

    if (voucher) {
      setVoucherUpdate(voucher);
      setIsUpdateModalVisible(!isUpdateModalVisible);
    } else {
      message.error("Something have been occured!");
    }
  };

  const columns = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      align: "center",
      width: "15rem",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      align: "center",
      width: "15rem",
    },
    {
      title: "Giá thấp nhất",
      dataIndex: "minimumOrderAmount",
      key: "minimumOrderAmount",
      align: "center",
      width: "13rem",
      render: (currency, record) => {
        // Use render function for custom formatting
        if (currency) {
          // Check if expiryDate exists
          return formatCurrency(currency); // format currency
        } else {
          return "-"; // Display "-" for missing data (optional)
        }
      },
    },
    {
      title: "Giảm(%)",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      align: "center",
      width: "5rem",
      render: (discount, record) => {
        // Use render function for custom formatting
        if (discount) {
          // Check if expiryDate exists
          return formatDiscount(discount); // Format discount
        } else {
          return "-"; // Display "-" for missing data (optional)
        }
      },
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      align: "center",
      width: "15rem",
      render: (data, record) => {
        // Use render function for custom formatting
        if (data) {
          // Check if expiryDate exists
          return dayjs(data).format(formattedDate); // Format using Day.js
        } else {
          return "-"; // Display "-" for missing data (optional)
        }
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      align: "center",
      width: "15rem",
      render: (data, record) => {
        // Use render function for custom formatting
        if (data) {
          // Check if expiryDate exists
          return dayjs(data).format(formattedDate); // Format using Day.js
        } else {
          return "-"; // Display "-" for missing data (optional)
        }
      },
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "modifiedDate",
      key: "modifiedDate",
      align: "center",
      width: "15rem",
      render: (data, record) => {
        // Use render function for custom formatting
        if (data) {
          // Check if expiryDate exists
          return dayjs(data).format(formattedDate); // Format using Day.js
        } else {
          return <LineOutlined />; // Display "-" for missing data
        }
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: "20rem",
      // dataSource: { data },
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="editButtonStyle"
            onClick={() => handleUpdateVoucher(record)}
            icon={<EditOutlined />}
          >
            Chỉnh sửa
          </Button>
          <Button
            className="deleteButtonStyle"
            onClick={() => handleDelete(record)}
            icon={<DeleteOutlined />}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updatingVoucher, setUpdatingVoucher] = useState(null);

  const showUpdateModal = (voucher) => {
    setUpdatingVoucher(voucher);
    setIsUpdateModalVisible(true);
  };

  console.log(voucherUpdate, "voucherUpdateee");
  useEffect(() => {
    const { description, minimumOrderAmount, discountPercentage, expiryDate } =
      voucherUpdate;

    const configDiscountPercentage = discountPercentage * 100;
    if (isUpdateModalVisible && voucherUpdate) {
      form.setFieldsValue({
        descriptionUpdate: description,
        minimumOrderAmountUpdate: minimumOrderAmount,
        discountPercentageUpdate: configDiscountPercentage,
        expiryDateUpdate: dayjs(expiryDate), // Use moment to format date
      });
    }
  }, [isUpdateModalVisible, voucherUpdate]);

  const handleUpdateVoucher = (values) => {
    setVoucherUpdate(values);
    setIsUpdateModalVisible(!isUpdateModalVisible);
    setCurrencyValueUpdate(values.minimumOrderAmount);
    console.log(values, "Handle Update Voucher");
    // const configExpiryDateUpdated = () => {
    //   // const newDate = new Date();
    //   const expiryDate1 = expiryDateUpdated.toDate();
    //   const newExpiryDate = expiryDate1.getDate() + 1;
    //   expiryDate1.setDate(newExpiryDate);
    //   return expiryDate1;
    // };
    // const configCurrentDate = () => {
    //   const currentDate1 = currentDate.toDate();
    //   const newCurrentDate = currentDate1.getDate() + 1;
    //   currentDate1.setDate(newCurrentDate);
    //   return currentDate1;
    // };

    // form.setFieldsValue({
    //   descriptionUpdate: description,
    //   minimumOrderAmountUpdate: minimumOrderAmount,
    //   discountPercentageUpdate: discountPercentage,
    //   expiryDateUpdate: expiryDate,
    // });

    // setData(newData);
  };
  const handleUpdateOk = () => {
    form
      .validateFields()
      .then((values) => {
        const {
          descriptionUpdate,
          minimumOrderAmountUpdate,
          discountPercentageUpdate,
          expiryDateUpdate,
        } = values;
        const configDiscountPercentageUpdate = discountPercentageUpdate / 100;
        const updatedVoucher = {
          ...voucherUpdate,
          description: descriptionUpdate,
          minimumOrderAmount: minimumOrderAmountUpdate,
          discountPercentage: configDiscountPercentageUpdate,
          expiryDate: expiryDateUpdate,
        };

        voucherServices
          .updateVoucherById(voucherUpdate?.id, updatedVoucher)
          .then((res) => {
            console.log(res, "res");
            message.success(
              `Update voucher ${voucherUpdate.description} sucessfully!`
            );
          })
          .catch((err) => console.log(err, "errors"));

        // Call API or perform update operation
        console.log("Updated Voucher Data:", updatedVoucher);
        setIsUpdateModalVisible(false); // Close modal after update
        form.resetFields(); // Reset form fields
      })
      .catch((error) => {
        console.error("Validation Failed:", error);
      });
  };

  const handleChangePagination = (page, pageSize) => {
    setPagination({
      ...pagination,
      page,
      size: pageSize,
    });
  };
  const handleChangePageSize = (current, size) => {
    setPagination({
      ...pagination,
      page: current,
      size,
    });
  };

  return (
    <div className="container_list">
      {/* <Header /> */}
      {/* <div
        style={{
          marginTop: "140px",
          marginLeft: "250px",
          marginRight: "250px",
        }}
      ></div> */}
      <div
        style={{
          textAlign: "center",
          fontSize: "5rem",
          fontWeight: "bolder",
          color: "#D5A153", // Màu sắc có thể tùy chỉnh
        }}
      >
        Vouchers
      </div>
      <div
        style={{
          marginTop: "5rem",
          marginLeft: "200px",
          marginRight: "200px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Tìm kiếm voucher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearch} // Gọi hàm tìm kiếm khi nhấn Enter
            suffix={
              <SearchOutlined
                onClick={handleSearch} // Gọi hàm tìm kiếm khi icon được nhấp
                style={{
                  cursor: "pointer",
                  color: "rgba(0,0,0,.45)",
                }}
              />
            }
            style={{ width: "40rem", marginRight: 8 }}
          />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button onClick={reloadData}>Tải lại</Button>
          <Button
            className="addButtonStyle"
            onClick={showModal}
            style={{
              display: "inline-flex",
              alignItems: "center",
            }}
            icon={<PlusOutlined />}
          >
            Thêm khuyến mãi mới
          </Button>
          <Modal
            title="Thêm voucher"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={"40rem"}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Quay lại
              </Button>,
              <Button type="primary" key="submit" onClick={handleCancel}>
                Hoàn tất
              </Button>,
            ]}
          >
            <Form form={form} onFinish={onFinish} layout="vertical">
              <Form.Item
                label="Mô tả"
                name="description"
                //   rules={[
                //     { required: true, message: "Please input the description!" },
                //   ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Giá thấp nhất"
                name="minimumOrderAmount"
                initialValue={100000}
                rules={[
                  {
                    required: true,
                    message: "Please input the minimum order amount!",
                  },
                ]}
              >
                <InputNumber
                  onChange={(value) => setCurrencyValue(value)}
                  min={1}
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Flex className="mt-3" gap={"small"}>
                {<DollarCircleOutlined />}
                <Typography.Text strong>
                  Giá: {formatCurrency(currencyValue)}
                </Typography.Text>
              </Flex>

              <Form.Item
                label="Giảm (%)"
                name="discountPercentage"
                tooltip={"Your discount can from 1% to 100%"}
                rules={[
                  {
                    required: true,
                    message: "Please input the discount percentage!",
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  max={100}
                  // formatter={(value) => `${value}`}
                  // parser={(value) => value.replace("%", "")}
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                label="Ngày hết hạn"
                name="expiryDate"
                tooltip="Ngày/Tháng/Năm"
                // initialValue={currentDate}
                rules={[
                  { required: true, message: "Vui lòng chọn ngày hết hạn!" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  // defaultValue={dayjs()} //if set defaultValue here, formItem does not receive data from initial //~~~~~~~~~~~~~~~~~~~~ Caution ~~~~~~~~~~~~~~~~~~~~ DatePicker or TimePicker receive Date Object, do not pass String value
                  format={formattedDate}
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf("day");
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                >
                  Tạo voucher
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Select
            defaultValue="newest"
            className="custom-select"
            onChange={handleSortChange}
            style={{ width: "18rem" }}
          >
            <Option value="newest">Ngày tạo mới nhất</Option>
            <Option value="oldest">Ngày tạo cũ nhất</Option>
            <Option value="ascending">Giảm từ thấp đến cao</Option>
            <Option value="descending">Giảm từ cao đến thấp</Option>
            <Option value="longest">Thời hạn dài</Option>
            <Option value="expiring">Sắp hết hạn</Option>
          </Select>
        </div>
      </div>
      <div
        style={{
          marginLeft: "200px",
          marginRight: "200px",
          marginTop: "2rem",
        }}
      >
        {/* <Table
          columns={columns.map((col) => ({
            ...col,
            className: "custom-header",
          }))}
          dataSource={data}
          pagination={{ pageSize: 5, position: ["bottomCenter"] }}
          rowClassName="custom-row"
        /> */}
        <Table
          columns={columns.map((col) => ({
            ...col,
            className: "custom-header",
          }))}
          dataSource={voucherList}
          pagination={{
            current: pagination.page,
            pageSize: pagination.size,
            // total: pagination.total,
            total: totalPages,
            onChange: handleChangePagination,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            position: ["bottomCenter"],
          }}
          rowClassName="custom-row"
        />
        <Modal
          title="Update Voucher"
          visible={isUpdateModalVisible}
          onOk={handleUpdateOk}
          onCancel={() => {
            setIsUpdateModalVisible(!isUpdateModalVisible);
            form.resetFields(); // Reset form khi đóng Modal
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="descriptionUpdate" label="Description">
              <Input />
            </Form.Item>
            <Form.Item
              label="Minimum Order Amount"
              name="minimumOrderAmountUpdate"
            >
              <InputNumber
                onChange={(value) => setCurrencyValueUpdate(value)}
                min={1}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Flex className="mt-3" gap={"small"}>
              {<DollarCircleOutlined />}
              <Typography.Text strong>
                Currency: {formatCurrency(currencyValueUpdate)}
              </Typography.Text>
            </Flex>
            <Form.Item
              label="Discount Percentage (%)"
              name="discountPercentageUpdate"
            >
              <InputNumber
                min={1}
                max={100}
                formatter={(value) => `${value}`}
                parser={(value) => value.replace("%", "")}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item label="Expiry Date" name="expiryDateUpdate">
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                disabledDate={(current) => {
                  return current && current < dayjs().startOf("day");
                }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default ManageVoucher;
