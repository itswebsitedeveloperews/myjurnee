import { COLORS } from '../../Common/Constants/colors';
import { IMAGES } from '../../Common/Constants/images';
import { StorageKeys, localStorageHelper } from '../../Common/localStorageHelper';
import { isFunction } from '../../Utils/Utils';
import {
  getMembershipPlans,
  getCheckoutSession,
  getMembershipByEmail
} from '../../api/dashboardApi';
import {
  onMembershipPlansSuccess,
  onUserMembershipSuccess,
} from './dashboardSlice';

const benefits = [
  { id: '1', icon: IMAGES.IC_LOCK, title: 'Unlock Extra Discount', subtitle: '& Low Prices' },
  { id: '2', icon: IMAGES.IC_SAVING, title: 'Instant Extra Discount', subtitle: 'In Flash Sales/ BOGO' },
  { id: '3', icon: IMAGES.IC_CASHBACK, title: 'Earn Extra Cashback', subtitle: 'as uCoin Cash' },
];

export const getMembershipPlansAction = ({ onSuccessPlans, onFailurePlans }) => {
  return async dispatch => {
    try {
      getMembershipPlans()
        .then(async response => {
          const updateResponse = await populatePlanResponse(response);

          if (isFunction(onSuccessPlans)) {
            onSuccessPlans();
          }
          dispatch(onMembershipPlansSuccess(updateResponse));
        })
        .catch(err => {
          console.log('----', err.response.data);
          if (isFunction(onFailurePlans)) {
            onFailurePlans();
          }
        });
    } catch (error) {
      console.log('Error!', error);
    }
  };
};

export const getCheckoutSessionAction = ({ data, onSuccessCheckout, onFailureCheckout }) => {
  return async dispatch => {
    try {
      getCheckoutSession(data)
        .then(async response => {

          console.log('response ---', response)
          if (!response.error) {
            if (isFunction(onSuccessCheckout)) {
              onSuccessCheckout(response?.checkout_url);
            }
          }
        })
        .catch(err => {
          console.log('----', err.response.data);
          if (isFunction(onFailureCheckout)) {
            onFailureCheckout();
          }
        });
    } catch (error) {
      console.log('Error!', error);
    }
  };
};

export const getMembershipByEmailAction = ({ email, onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      const data = { email };
      getMembershipByEmail(data)
        .then(response => {
          console.log('membership by email response ---', response);
          if (!response.error) {
            if (isFunction(onSuccess)) {
              onSuccess(response);
            }
            dispatch(onUserMembershipSuccess(response?.membership || {}));
          } else {
            if (isFunction(onFailure)) {
              onFailure();
            }
          }
        })
        .catch(err => {
          console.log('getMembershipByEmail error ---', err.response?.data || err);
          if (isFunction(onFailure)) {
            onFailure();
          }
        });
    } catch (error) {
      console.log('Error!', error);
    }
  };
};

const populatePlanResponse = async (apiResponse) => {
  if (!apiResponse) {
    return []
  }

  const membershipPlans = Object.keys(apiResponse).map(key => {
    const item = apiResponse[key];

    return {
      id: item.id,
      title: item.name,
      price: Number(item.initial_payment)?.toFixed(2),
      period: `/${item.cycle_period}`,
      subtitle: `or Shop for £10,000 in a year & get for FREE`,
      benefits,
      linearColor:
        item.id === "2"
          ? ['#EC4E1E', '#FF9248']
          : ['rgba(0, 0, 0, 0.6)', 'transparent'],
      backgroundColor:
        item.id === "2" ? '#FF9248' : COLORS.purple,
    };
  });
  return membershipPlans;
}