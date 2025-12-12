import { COLORS } from '../../Common/Constants/colors';
import { IMAGES } from '../../Common/Constants/images';
import { StorageKeys, localStorageHelper } from '../../Common/localStorageHelper';
import { isFunction } from '../../Utils/Utils';
import {
  getMembershipPlans,
  getCheckoutSession,
  getMembershipByEmail,
  cancelSubscription
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

export const getMembershipPlansAction = ({ userId, onSuccessPlans, onFailurePlans }) => {
  return async dispatch => {
    try {
      getMembershipPlans(userId)
        .then(response => {
          const updateResponse = populatePlanResponse(response);

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

export const cancelMembershipAction = ({ email, onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      const data = { email };
      console.log('cancel membership data ---', data);
      cancelSubscription(data)
        .then(response => {
          console.log('cancel subscription response ---', response);
          if (!response.error) {
            if (isFunction(onSuccess)) {
              onSuccess(response);
            }
            // Clear user membership from Redux state after successful cancellation
            dispatch(onUserMembershipSuccess({}));
          } else {
            if (isFunction(onFailure)) {
              onFailure(response?.message || 'Failed to cancel membership');
            }
          }
        })
        .catch(err => {
          console.log('cancel subscription error ---', err.response?.data || err);
          if (isFunction(onFailure)) {
            onFailure(err.response?.data?.message || 'Failed to cancel membership');
          }
        });
    } catch (error) {
      console.log('Error!', error);
      if (isFunction(onFailure)) {
        onFailure('An unexpected error occurred');
      }
    }
  };
};

const populatePlanResponse = (apiResponse) => {
  if (!apiResponse || !apiResponse.levels || !Array.isArray(apiResponse.levels)) {
    return []
  }

  const membershipPlans = apiResponse.levels.map(item => {
    // Handle floating-point precision issues by parsing and rounding properly
    const initialPayment = item.initial_payment != null
      ? parseFloat(item.initial_payment).toFixed(2)
      : '0.00';

    return {
      id: item.id,
      title: item.name,
      price: initialPayment,
      period: `/${item.cycle_period}`,
      subtitle: `or Shop for £10,000 in a year & get for FREE`,
      benefits,
      purchased: item.accessed,
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