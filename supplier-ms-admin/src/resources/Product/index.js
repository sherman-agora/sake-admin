import React, { useEffect } from "react";
import {
  Create,
  Edit,
  SimpleForm,
  List,
  Datagrid,
  EditButton,
  DeleteButton,
  TextField,
  ImageField,
  SingleFieldList,
  ChipField,
  TextInput,
  NumberInput,
  ImageInput,
  DateInput,
  ReferenceArrayField,
  ReferenceArrayInput,
  SelectArrayInput,
  required,
  SelectInput,
  FormDataConsumer,
  TopToolbar,
  CreateButton,
  Button,
  useNotify,
  BooleanInput,
  FunctionField,
  useListContext,
  Pagination
} from "react-admin";
import BilingualField from "../../components/BilingualField";
import { ProductShow } from "./Show";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";
import { useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import IconEvent from "@material-ui/icons/Event";
import { ExportToCsv } from "export-to-csv";
import DeleteDialog from "../../utils/deleteDialog";

const redirect = () => "/Product";

export { ProductShow };

const breadcrumbBase = { url: "/Product", label: "Product" };

export const ProductCreate = (props) => {
  const dispatch = useDispatch();
  dispatch(
    setBreadcrumbs([
      breadcrumbBase,
      { url: "/Product/create", label: "Create New" },
    ])
  );
  return (
    <Create {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <TextInput source="code" validate={required()} label="Product No." />
        <TextInput source="brandEn" validate={required()} fullWidth />
        <TextInput source="brandChi" validate={required()} fullWidth />
        <TextInput source="nameEn" validate={required()} fullWidth />
        <TextInput source="nameChi" validate={required()} fullWidth />
        <NumberInput source="package" validate={required()} />
        <TextInput source="discount" />
        <TextInput source="weight" validate={required()} />
        <TextInput source="shortDescription" />
        <TextInput source="longDescription" />
        <ImageInput source="images" accept="image/*" multiple>
          <ImageField source="src" title="title" />
        </ImageInput>
        <TextInput source="sku" />
        <TextInput source="upc" validate={required()} />
        <NumberInput source="cost" validate={required()} />
        <NumberInput source="wholeSalePrice1" validate={required()} />
        <NumberInput source="wholeSalePrice2" validate={required()} />
        <NumberInput source="wholeSalePrice3" validate={required()} />
        <NumberInput source="wholeSalePrice4" validate={required()} />
        <NumberInput source="wholeSalePrice5" validate={required()} />
        <NumberInput source="retailPrice1" validate={required()} />
        <NumberInput source="retailPrice2" validate={required()} />
        <NumberInput source="retailPrice3" validate={required()} />
        <NumberInput source="retailPrice4" validate={required()} />
        <NumberInput source="retailPrice5" validate={required()} />
        <NumberInput source="minOrderQuantity" defaultValue={10} />
        <NumberInput source="minStockLevel" defaultValue={0} />
        <DateInput source="onlineDate" />
        <DateInput source="offlineDate" />
        {/* <ReferenceArrayInput
          label="Category"
          source="categoriesIds"
          reference="ProductCategory"
        >
          <SelectArrayInput optionText="nameEn" />
        </ReferenceArrayInput> */}
      </SimpleForm>
    </Create>
  );
};

export const ProductEdit = (props) => {
  const dispatch = useDispatch();
  return (
    <Edit {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <TextInput source="code" validate={required()} label="Product No." />
        <TextInput source="brandEn" validate={required()} fullWidth />
        <TextInput source="brandChi" validate={required()} fullWidth />
        <TextInput source="nameEn" validate={required()} fullWidth />
        <TextInput source="nameChi" validate={required()} fullWidth />
        <NumberInput source="package" validate={required()} />
        <TextInput source="discount" />
        <TextInput source="weight" validate={required()} />
        <TextInput source="shortDescription" />
        <TextInput source="longDescription" />
        <ImageInput source="images" accept="image/*" multiple>
          <ImageField source="src" title="title" />
        </ImageInput>
        <TextInput source="sku" />
        <TextInput source="upc" />
        <NumberInput source="cost" validate={required()} />
        <NumberInput source="wholeSalePrice1" validate={required()} />
        <NumberInput source="wholeSalePrice2" validate={required()} />
        <NumberInput source="wholeSalePrice3" validate={required()} />
        <NumberInput source="wholeSalePrice4" validate={required()} />
        <NumberInput source="wholeSalePrice5" validate={required()} />
        <NumberInput source="minOrderQuantity" />
        <NumberInput source="minStockLevel" />
        <DateInput source="onlineDate" />
        <DateInput source="offlineDate" />
        <ReferenceArrayInput
          label="Category"
          source="categoriesIds"
          reference="ProductCategory"
        >
          <SelectArrayInput optionText="nameEn" />
        </ReferenceArrayInput>
        <BooleanInput label="Print in Invoice" source="printInInvoice" />
        <BooleanInput label="Print in Delivery Note" source="printInDN" />
        <FormDataConsumer>
          {({ formData }) => {
            console.log("formData: ", formData);
            if (formData.printInLabel === undefined) {
              console.log("formData.printing check", formData.printInLabel);
              formData.printInLabel = true;
            }
            dispatch(
              setBreadcrumbs([
                breadcrumbBase,
                {
                  url: `/Product/${formData.id}`,
                  label: `Edit: ${formData.code}`,
                },
              ])
            );
            return <BooleanInput label="Show in Printing" source="printInLabel" />;
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Edit>
  );
};

const GET_PRODUCT = gql`
  query expiryDateSummaries {
    expiryDateSummaries(orderBy: productId_ASC) {
      product {
        id
        code
        brandEn
        brandChi
        nameEn
        nameChi
        package
        weight
        shortDescription
        longDescription
        quantity
        sku
        upc
        cost
        wholeSalePrice1
        wholeSalePrice2
        wholeSalePrice3
        wholeSalePrice4
        wholeSalePrice5
      }
      items {
        expiryDate
        warehouse {
          name
        }
      }
      expiryDate
    }
  }
`;
const GET_WAREHOUSE = gql`
  query {
    warehouses {
      name
    }
  }
`;

const ListActions = (props) => {
  const notify = useNotify();
  const day = new Date();
  const options = {
    filename: `Products Report - ${day.toISOString()}`,
    title: `Products Report - ${day.toISOString()}`,
    useKeysAsHeaders: true,
    showTitle: true,
  };
  const csvExporter = new ExportToCsv(options);

  const [startCSV, { loading: fetching, data: houses }] = useLazyQuery(
    GET_WAREHOUSE,
    {
      onCompleted: async (value) => { },
    }
  );

  const [getProduct, { loading, data }] = useLazyQuery(GET_PRODUCT, {
    onCompleted: (value) => {
      console.log("value: ", value);
      const backendWarehouses = houses.warehouses.reduce((pre, cur) => {
        pre[cur.name] = 0;
        return pre;
      }, {});

      const format = value.expiryDateSummaries.reduce((results, curr) => {
        const { product, items, ...other } = curr;
        console.log("backendWarehouses: ", { ...backendWarehouses });

        const warehouses = items.reduce(
          (pre, item) => {
            const preQuantity = !!pre[item.warehouse.name]
              ? pre[item.warehouse.name]
              : 0;
            pre[item.warehouse.name] = preQuantity + 1;
            return pre;
          },
          { ...backendWarehouses }
        );

        results[`${product.id}--${curr.expiryDate}`] = {
          ...product,
          ...warehouses,
          ...other,
        };
        return results;
      }, {});
      console.log("format: ", format);
      const dataList = Object.values(format);
      csvExporter.generateCsv(dataList);
    },
  });

  useEffect(() => {
    if (houses) {
      getProduct();
    }
  }, [houses]);

  return (
    <TopToolbar>
      <CreateButton basePath="Product" />
      <Button
        onClick={() => {
          startCSV();
          notify(`Start Loading.... \n (It may take some time)`);
        }}
        label="Show calendar"
      >
        <IconEvent />
      </Button>
    </TopToolbar>
  );
};

const PostPagination = props => {
  const {total} = useListContext()
  console.log('total', total)
  return (<Pagination rowsPerPageOptions={[25, 50, 100,total]} {...props} />)
};

export const ProductList = (props) => {
  const dispatch = useDispatch();
  dispatch(setBreadcrumbs([breadcrumbBase]));
  return (
    <List
      {...props}
      exporter={false}
      actions={<ListActions />}
      filterDefaultValues={{ code_not: " " }}
      pagination={<PostPagination/>}
    >
      <Datagrid rowClick="show">
        <TextField source="code" label="Product No." />
        <BilingualField source="name" />
        <ReferenceArrayField
          label="Categories"
          reference="ProductCategory"
          source="categoriesIds"
        >
          <SingleFieldList>
            <ChipField source="nameChi" />
          </SingleFieldList>
        </ReferenceArrayField>
        <EditButton />
        <FunctionField
          render={(record) => (
            <DeleteDialog
              record={record}
              props={props}
            // permissions={permissions}
            />
          )}
        />
      </Datagrid>
    </List>
  );
};
