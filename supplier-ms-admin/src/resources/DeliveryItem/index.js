import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SaveButton, Toolbar, useCreate, useNotify, Create, SimpleForm, AutocompleteInput, NumberInput, ReferenceInput, SelectInput, Edit, FormDataConsumer, useTranslate } from 'react-admin';
import { useFormState } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { addBreadcrumbs } from '../../redux/breadcrumbs';
import { Grid, Container } from '@material-ui/core';
import ShowText from "../../components/Shows/ShowText";
import ItemAutocomplete from "../DeliveryNote/Create/ItemAutocomplete";
import { useLocation } from 'react-router-dom';
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import TextField from '@material-ui/core/TextField';


const UPDATEDELIVERY = gql`
    mutation updateDeliveryNote($data: DeliveryNoteUpdateInput!, $where: DeliveryNoteWhereUniqueInput!) {
        updateDeliveryNote(data: $data, where: $where) {
        id
      }
    }
  `;

export const DeliveryItemEdit = (props) => {
    const notify = useNotify();
    const [updateDeliveryNote] = useMutation(UPDATEDELIVERY);
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const record = location.state.record;
    const [selectedProduct, setSelectedProduct] = useState();

    const EditSaveButton = (props) => {
        const handleClick = () => {
            updateDeliveryNote({
                variables: {
                    where: {
                        id: record.deliveryNote.id
                    },
                    data: {
                        items: {
                            update: {
                                where: { id: record.id },
                                data: { itemId: selectedProduct.itemId, productId: selectedProduct.id, boxNum: selectedProduct.boxNum }
                            }
                        }
                    }
                },
            })
                .then((value) => {
                    console.log("res", value);
                    notify(`Save Success.`);
                    redirect()
                })
                .catch((error) => {
                    notify(`Error: ${error.message}`, "warning");
                });
        }

        return <SaveButton {...props} handleSubmitWithRedirect={handleClick} />;
    };

    const DeliveryEditItemToolbar = (props) => (
        <Toolbar {...props}>
            <EditSaveButton label="common.save" submitOnEnter={false} variant="text" />
        </Toolbar>
    );

    const OptionRenderer = (choice) => `${choice.record.code} ${choice.record.nameChi}`;

    const inputText = (record) => () => {
        setSelectedProduct(record);
        return `${record.code} ${record.nameChi}`;
    };

    const searchProduct = (searchText) => ({
        code_contains: searchText,
    });

    const redirect = () => {
        return history.go(-1);
    };

    const handleOnChange = (value) => {
        selectedProduct.itemId = value.id;
    }

    const renderLable = () => {
        const tempProduct = {
            id: selectedProduct.id,
            product: {
                id: selectedProduct.id,
                code: selectedProduct.code
            }
        }
        return (
            <Grid container direction="column" style={{ width: 280 }}>
                <ShowText label="Select lable">
                    <ItemAutocomplete onChange={handleOnChange} placeholder="Label" products={[tempProduct]} />
                </ShowText>
            </Grid>
        )
    }
    const onNumberChange = (event) => {
        selectedProduct.boxNum = parseInt(event.target.value)
    }

    return (
        <Edit actions={<React.Fragment />} {...props}>
            <SimpleForm variant="standard" redirect={redirect} toolbar={<DeliveryEditItemToolbar />}>
                <ReferenceInput filterToQuery={searchProduct} label="Product" source="product.id" reference="Product">
                    <AutocompleteInput disabled optionText={<OptionRenderer />} label="DeliveryNote" inputText={inputText} matchSuggestion={(filterValue, suggestion) => true} options={{ style: { width: 500 } }} />
                </ReferenceInput>
                {selectedProduct && renderLable()}
                <ShowText label="BoxNum">
                    <TextField type="number" onChange={onNumberChange} placeholder="BoxNumber" />
                </ShowText>
                <FormDataConsumer>
                    {({ formData }) => {
                        dispatch(addBreadcrumbs({ url: `/DeliveryItem/${formData.id}`, label: `Edit` }));
                        return null;
                    }}
                </FormDataConsumer>
            </SimpleForm>
        </Edit>
    );
};
