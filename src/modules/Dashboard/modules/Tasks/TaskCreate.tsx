import { useNavigate } from "react-router-dom";
import { createTask, getUUID } from "./TaskApis";
import styles from "../../../../components/MuComponents/FormikComponents/form.module.css";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FormikSelect, FormikTextInput } from "../../../../components/MuComponents/FormikComponents/FormikComponents";
import { MuButton } from "../../../../components/MuComponents/MuButtons/MuButton";
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

type Props = {};


const TaskCreate = (props: Props) => {
    const navigate = useNavigate();
    const toast = useToast();
    const [uuidData,setuuidData] =  useState< {[index: string]: any[]} | null>(null);

    useEffect(()=>{
        (async ()=>{
            try{
                setuuidData(await getUUID())
            }catch(err){
                console.log(err as AxiosError)
            }
        })()
    },[])



	const taskEditSchema = Yup.object().shape({
        hashtag: Yup.string()
            .required("Required")
            .min(2, "Too Short!")
            .max(30, "Too Long!"),
        title: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            .required("Required"),
        karma: Yup.number()
            .positive("Karma should be a positive value")
            .min(10, "Needs to be at least 2 digits.")
            .max(9999, "Should not exceed 4 digits")
            .truncate()
            .required("Karma is required"),
        usage_count: Yup.number()
            .truncate()
            .required("Mention the number of uses"),
        active: Yup.boolean().required("Select an option"),
        variable_karma: Yup.boolean().required("Select an option"),
        description: Yup.string().min(4, "Too Short!").max(100, "Too Long!"),
        channel_id: Yup.string(),
        type_id: Yup.string(),
        level_id: Yup.string(),
        ig_id: Yup.string(),
        organization_id: Yup.string(),
    });

    return (
        <div className={styles.external_container}>
            <div className={styles.container}>
                <h1 className={styles.text}>IG Edit Page</h1>
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        hashtag: "",
                        title: "",
                        karma: "",
                        usage_count: "",
                        active: "",
                        variable_karma: "",
                        description: "",
                        channel_id: "",
                        type_id: "",
                        level_id: "",
                        ig_id: "",
                        organization_id:""
                    }}
                    validationSchema={taskEditSchema}
                    onSubmit={values => {
                        createTask(
                            values.hashtag,
                            values.title,
                            values.karma,
                            values.usage_count,
                            values.active,
                            values.variable_karma,
                            values.description,
                            values.channel_id,
                            values.type_id,
                            values.level_id,
                            values.ig_id,
                            values.organization_id
                        );
                        toast({
                            title: "Interest Group created",
                            status: "success",
                            duration: 3000,
                            isClosable: true
                        });
                        navigate("/tasks");
                    }}
                >
                    <Form className={styles.inputContainer}>
                        <FormikTextInput
                            label="Hashtag"
                            name="hashtag"
                            type="text"
                            placeholder="#example"
                        />
                        <FormikTextInput
                            label="Title"
                            name="title"
                            type="text"
                            placeholder="Enter the title"
                        />
                        <FormikTextInput
                            label="Karma"
                            name="karma"
                            type="number"
                            placeholder="Karma points"
                        />
                        <FormikTextInput
                            label="Usage Count"
                            name="usage_count"
                            type="number"
                            placeholder="No. of times to be used"
                        />
                        <FormikSelect label="Active" name="active">
                            <option value="">Select an option</option>
                            <option value="1">True</option>
                            <option value="0">False</option>
                        </FormikSelect>
                        <FormikSelect
                            label="Variable Karma"
                            name="variable_karma"
                        >
                            <option value="">Select an option</option>
                            <option value="1">True</option>
                            <option value="0">False</option>
                        </FormikSelect>
                        <FormikTextInput
                            label="Description"
                            name="description"
                            type="text"
                            placeholder="..."
                        />
                        <FormikSelect
                            label="Channel ID"
                            name="channel_id"
                            disabled = {!uuidData}
                        >
                            <option value="">Select an option</option>
                            {uuidData?.channel.map((val)=>{
                                return (
                                    <option value={val.id}>
                                        {val.name}
                                    </option>
                                )
                            })}
                        </FormikSelect>
                        <FormikSelect
                            label="Type ID"
                            name="type_id"
                            disabled = {!uuidData}
                        >
                            <option value="">Select an option</option>
                            {uuidData?.type.map((val)=>{
                                return (
                                    <option value={val.id}>
                                        {val.title}
                                    </option>
                                )
                            })}
                        </FormikSelect>
                        <FormikSelect
                            label="Level ID"
                            name="level_id"
                            disabled = {!uuidData}
                        >
                            <option value="">Select an option</option>
                            {uuidData?.level.map((val)=>{
                                return (
                                    <option value={val.id}>
                                        {val.name}
                                    </option>
                                )
                            })}
                        </FormikSelect>
                        <FormikSelect
                            label="IG ID"
                            name="ig_id"
                            disabled = {!uuidData}
                        >
                            <option value="">Select an option</option>
                            {uuidData?.ig.map((val)=>{
                                return (
                                    <option value={val.id}>
                                        {val.name}
                                    </option>
                                )
                            })}
                        </FormikSelect>
                        <FormikSelect
                            label="Organization ID"
                            name="organization_id"
                            disabled = {!uuidData}
                        >
                            <option value="">Select an option</option>
                            {uuidData?.organization
                            .map((val)=>{
                                return (
                                    <option value={val.id}>
                                        {val.title}
                                    </option>
                                )
                            })}
                        </FormikSelect>
                        <div className={styles.btn_container}>
                            <MuButton
                                text={"Decline"}
                                className={styles.btn_cancel}
                                onClick={() => {
                                    navigate("/tasks");
                                }}
                            />
                            <button type="submit" className={styles.btn_submit}>
                                Confirm
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default TaskCreate;
