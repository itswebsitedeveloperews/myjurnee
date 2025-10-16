import {StorageKeys, localStorageHelper} from '../../Common/localStorageHelper';
import {isFunction} from '../../Utils/Utils';
import {
  getAgencyByProject,
  getAgencyDetails,
  getAgencyforCategory,
  getAssignedAgencyOfuser,
  getCategory,
  getProjectDetails,
  getProjects,
  getSubCategorys,
  saveArchitectWorkProject,
  searchCategory,
} from '../../api/dashboardApi';
import {
  onAgencyDetailSuccess,
  onAllAgencySuccess,
  onAssignedAgencyListSuccess,
  onCategorySuccess,
  onCategoryWiseAgencySuccess,
  onGetPastProjectsSuccess,
  onGetProjectAssignedAgencyList,
  onGetProjectDetailSuccess,
  onGetProjectsSuccess,
  onSearchCategorySuccess,
  onSubCategorySuccess,
} from './dashboardSlice';

export const getDashboardCategory = ({onSuccess, onFailure}) => {
  return async dispatch => {
    try {
      getCategory()
        .then(response => {
          // console.log('category response---', response);
          if (response?.status == 200) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
            dispatch(onCategorySuccess(response?.data));
          }
        })
        .catch(err => {
          console.log('----', err.response.data);
          if (isFunction(onFailure)) {
            onFailure();
          }
        });
    } catch (error) {
      console.log('Error!', error);
    }
  };
};

export const getUserProjects = ({status = 0, onSuccess, onFailure}) => {
  return async dispatch => {
    try {
      var formdata = new FormData();
      formdata.append('status', status);
      getProjects(formdata)
        .then(response => {
          //   console.log('projects response---', response);
          if (response?.status == 200) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
            if (status == 1) {
              dispatch(onGetProjectsSuccess(response?.data));
            } else {
              dispatch(onGetPastProjectsSuccess(response?.data));
            }
          }
        })
        .catch(err => {
          console.log('error in get projects---', err.response.data);
          if (isFunction(onFailure)) {
            onFailure();
          }
        });
    } catch (error) {
      console.log('Error!', error);
    }
  };
};

export const getUserProjectDetail = ({
  projectId = null,
  onSuccess,
  onFailure,
}) => {
  return async dispatch => {
    try {
      var formdata = new FormData();
      formdata.append('project_id', projectId);
      getProjectDetails(formdata)
        .then(response => {
          //   console.log('projects response---', response);
          if (response?.status == 200) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
            dispatch(onGetProjectDetailSuccess(response?.data));
          }
        })
        .catch(err => {
          console.log('error in get project detail---', err.response.data);
          if (isFunction(onFailure)) {
            onFailure();
          }
        });
    } catch (error) {
      console.log('Error!', error);
    }
  };
};

export const getProjectAssignedAgencyList = ({
  projectId = null,
  onSuccess,
  onFailure,
}) => {
  return async dispatch => {
    try {
      var formdata = new FormData();
      formdata.append('project_id', projectId);
      getAgencyByProject(formdata)
        .then(response => {
          //   console.log('projects response---', response);
          if (response?.status == 200) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
            dispatch(onGetProjectAssignedAgencyList(response?.data));
          }
        })
        .catch(err => {
          console.log('error  get project agency detail---', err.response.data);
          if (isFunction(onFailure)) {
            onFailure();
          }
        });
    } catch (error) {
      console.log('Error!', error);
    }
  };
};

export const searchCategories = ({text, onSuccess, onFailure}) => {
  return async dispatch => {
    var formdata = new FormData();
    formdata.append('search', text);
    searchCategory(formdata)
      .then(response => {
        if (response?.status == 200) {
          if (isFunction(onSuccess)) {
            onSuccess();
          }
          dispatch(onSearchCategorySuccess(response?.data));
        }
      })
      .catch(err => {
        console.log('error in get category search data', err.response.data);
        if (isFunction(onFailure)) {
          onFailure();
        }
      });
  };
};

export const getSubCategory = ({categoryId = null, onSuccess, onFailure}) => {
  return async dispatch => {
    try {
      var formdata = new FormData();
      formdata.append('category_id', categoryId);
      getSubCategorys(formdata)
        .then(response => {
          //   console.log('projects response---', response);
          if (response?.status == 200) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
            dispatch(onSubCategorySuccess(response?.data));
          }
        })
        .catch(err => {
          console.log('error in get sub category---', err.response.data);
          if (isFunction(onFailure)) {
            onFailure();
          }
        });
    } catch (error) {
      console.log('Error!', error);
    }
  };
};

export const getCategoryWiseAgency = ({
  categoryId = null,
  onSuccess,
  onFailure,
}) => {
  return async dispatch => {
    try {
      var formdata = new FormData();
      formdata.append('category_id', categoryId);
      getAgencyforCategory(formdata)
        .then(response => {
          //   console.log('projects response---', response);
          if (response?.status == 200) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
            dispatch(onCategoryWiseAgencySuccess(response?.data));
          }
        })
        .catch(err => {
          console.log('error in get categorywise agency---', err.response.data);
          if (isFunction(onFailure)) {
            onFailure();
          }
        });
    } catch (error) {
      console.log('Error!', error);
    }
  };
};

export const getSubCategoryWiseAgency = ({
  subCategoryId = null,
  onSuccess,
  onFailure,
}) => {
  return async dispatch => {
    try {
      var formdata = new FormData();
      formdata.append('subcategory_id', subCategoryId);
      getAgencyforCategory(formdata)
        .then(response => {
          //   console.log('projects response---', response);
          if (response?.status == 200) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
            dispatch(onAllAgencySuccess(response?.data));
          }
        })
        .catch(err => {
          console.log('error in subcategorywise agency---', err.response.data);
          if (isFunction(onFailure)) {
            onFailure();
          }
        });
    } catch (error) {
      console.log('Error!', error);
    }
  };
};

export const getAgencyDetail = ({agencyId = null, onSuccess, onFailure}) => {
  return async dispatch => {
    try {
      var formdata = new FormData();
      formdata.append('agency_id', agencyId);
      getAgencyDetails(formdata)
        .then(response => {
          //   console.log('projects response---', response);
          if (response?.status == 200) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
            dispatch(onAgencyDetailSuccess(response?.data));
          }
        })
        .catch(err => {
          console.log('error in agency detail---', err.response.data);
          if (isFunction(onFailure)) {
            onFailure();
          }
        });
    } catch (error) {
      console.log('Error!', error);
    }
  };
};

export const saveArchitectProject_Agencies = ({
  payload,
  onSuccess,
  onFailure,
}) => {
  return async dispatch => {
    try {
      saveArchitectWorkProject(payload)
        .then(response => {
          // console.log('projects save response---', response);
          if (response?.status == 200) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
          }
        })
        .catch(err => {
          console.log('error in architect save project---', err.response.data);
          if (isFunction(onFailure)) {
            onFailure();
          }
        });
    } catch (error) {
      console.log('Error!', error);
    }
  };
};

export const getSelectedAgenciesofUser = ({onSuccess, onFailure}) => {
  return async dispatch => {
    try {
      var formdata = new FormData();

      localStorageHelper
        .getItemFromStorage(StorageKeys.USER_ID)
        .then(async userId => {
          formdata.append('user_id', userId);
          return getAssignedAgencyOfuser(formdata)
            .then(response => {
              if (response?.status == 200) {
                if (isFunction(onSuccess)) {
                  onSuccess();
                }
                dispatch(onAssignedAgencyListSuccess(response?.data));
              }
            })
            .catch(err => {
              console.log('error in user agency', err.response.data);
              if (isFunction(onFailure)) {
                onFailure();
              }
            });
        });
    } catch (error) {
      console.log('Error!', error);
      if (isFunction(onFailure)) {
        onFailure();
      }
    }
  };
};
