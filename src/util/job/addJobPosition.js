import axios from 'axios';
import store from '../../store';
import Config from '../../config';

const { bdnUrl } = Config.network;
const ADD_JOB_URL = `${bdnUrl}api/v1/jobs/`;


export default function addJobPosition(jobData) {
  return function action(dispatch) {
    dispatch({
      type: 'ADD_JOB_REQUEST',
    });
    const axiosConfig = {
      headers: {
        'Auth-Signature': store.getState().auth.signedAddress,
        'Auth-Eth-Address': store.getState().auth.address.slice(2),
      },
    };
    const postData = {
      title: jobData.title ? jobData.title : null,
      location: jobData.location ? jobData.location : null,
      salary: jobData.salary ? jobData.salary : null,
      overview: jobData.overview ? jobData.overview : null,
      skills: jobData.skills ? jobData.skills : null,
      description: jobData.description ? jobData.description : null,
      external_link: jobData.external_link ? jobData.external_link : null,
      industries: jobData.industries ? jobData.industries : null,
      closes: jobData.closes ? jobData.closes : null,
      experience: jobData.experience ? jobData.experience : null,
      hours: jobData.hours ? jobData.hours : null,
      languages: jobData.languages ? jobData.languages : null,
    };
    axios.post(ADD_JOB_URL, postData, axiosConfig).then(() => {
      dispatch({
        type: 'ADD_JOB_SUCCESS',
      });
    }).catch(() => {
      dispatch({
        type: 'ADD_JOB_FAILURE',
        error: 'Fail',
      });
    });
  };
}
