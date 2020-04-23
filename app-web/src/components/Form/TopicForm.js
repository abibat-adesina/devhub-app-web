import { React, useMemo, useState, Fragment } from 'react';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { MyTextInput, MyCheckbox, MySelect, StyledLabel } from './form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { graphql, useStaticQuery } from 'gatsby';
import { flattenGatsbyGraphQL } from '../../utils/dataHelpers';
import { Author } from '../RocketChatItem/RocketChatItem';
import { faPlus,faMinus } from '@fortawesome/free-solid-svg-icons';

export const TopicForm = () => {
    const [inputFields, setInputFields] = useState([
        {
            sourceType: '',
            gitUrl: '',
            gitUsername: '',
            gitReponame: '',
            gitFilepath: [],
            webUrl: '',
            webTitle: '',
            webDescription: ''
        }
    ]);
    let content;

    const handleAddFields = () => {
        const values = [...inputFields]
        values.push({
            sourceType: '',
            gitUrl: '',
            gitUsername: '',
            gitReponame: '',
            gitFilepath: [],
            webUrl: '',
            webTitle: '',
            webDescription: ''
        })
        setInputFields(values)
    }

    const handleRemoveFields = (index) => {
        if (index === 0){
            return;
        }
        const values = [...inputFields]
        values.splice(index,1)
        setInputFields(values)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log("input fields", inputFields)
        // console.log('A topic was submitted :',currTopic,currSourcetype)
        // alert('A topic was submitted :'+currTopic+currSourcetype)

    }
    const handleChange = (event,index) => {

        const values = [...inputFields]
        console.log(index)
        const map = [
            'sourceType',
            'gitUrl',
            'gitUsername',
            'gitReponame',
            'gitFilepath',
            'webUrl',
            'webTitle',
            'webDescription'
        ]
        if(event.target.name === 'sourceType'){
            values[index].sourceType = event.target.value
        }
        if (event.target.name === 'gitUrl') {
            console.log("yaha pra yeh hain index",index)
            values[index].gitUrl = event.target.value
        }
        setInputFields(values)
    }

    const LoadSubForm = ({index}) => {
        console.log("here is the index -->>>",index)
        console.log("printing here ",inputFields[0].sourceType)
        if (inputFields[index].sourceType === "github") {
            return (
                <Fragment>
                    <MyTextInput name="gitUrl" label="Enter github repository url" onChange={e => handleChange(e,index)}></MyTextInput>
                    <MyTextInput name="gitUsername" label="Enter repository owner's github user name" onChange={e => handleChange(e,index)}></MyTextInput>
                    <MyTextInput name="gitReponame" label="Enter repository name" onChange={e => handleChange(e,index)}></MyTextInput>
                    <MyTextInput name="gitFilepath" label="Enter path to files from root of your repository" onChange={e => handleChange(e,index)}></MyTextInput>
                </Fragment>
            );
        }
        else if (inputFields[index].sourceType === "web") {
            return (
                <Fragment>
                    <MyTextInput name="webUrl" label="Enter source url" onChange={e => handleChange(e,index)} ></MyTextInput>
                    <MyTextInput name="webTitle" label="Enter a title for source" onChange={e => handleChange(e,index)}></MyTextInput>
                    <MyTextInput name="webDescription" label="Enter source description" onChange={e => handleChange(e,index)}></MyTextInput>
                </Fragment>
            );
        }
        else{
            return(
                null
            );
        }
    }

    return (
        <form onSubmit={e => handleSubmit(e)}>
            <MyTextInput label="What would you like to name the topic ?" name="topicName" onChange={e => handleChange(e)}>
            </MyTextInput>
            <MyTextInput label="Enter topic description"></MyTextInput>
            {inputFields.map((inputField, index) => (
                <Fragment key={`${inputField}~${index}`}>
                    <MySelect name="sourceType" label="Select sourcetype for your data" onChange={e => handleChange(e,index)}>
                        <option value="">Select Source type</option>
                        <option value="web">Web</option>
                        <option value="github">Github</option>
                    </MySelect>
                    <LoadSubForm index={index}></LoadSubForm>
                    <button onClick={() => handleAddFields()}><FontAwesomeIcon icon={faPlus} /></button>
                    <button onClick={() =>handleRemoveFields(index)}><FontAwesomeIcon icon={faMinus} /></button>
                {/* {content} */}
                </Fragment>
            ))}
            <button type="Submit">Submit</button>
        </form>
    );
}

export default TopicForm;