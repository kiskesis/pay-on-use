use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LookupMap;
use near_sdk::{env, near_bindgen, AccountId, ext_contract, PromiseResult};
near_sdk::setup_alloc!();

const ROCKETO_CONTRACT: &str = "streaming-r-v2.dcversus.testnet";

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct PayOnUse {
    deposits: LookupMap<AccountId, u128>,
}

/// Helper structure for keys of the persistent collections.
#[derive(BorshSerialize)]
pub enum StorageKey {
    Deposits,
}

impl Default for PayOnUse {
    fn default() -> Self {
        Self {
            deposits: LookupMap::new(StorageKey::Deposits.try_to_vec().unwrap()),
        }
    }
}

// define the methods we'll use on the other contract
#[ext_contract(ext_ft)]
pub trait RocketoContract {
    fn pause_stream(&mut self, stream_id: String);
    fn start_stream(&mut self, stream_id: String);
}

// define methods we'll use as callbacks on our contract
#[ext_contract(ext_self)]
pub trait MyContract {
    fn my_callback(&self) -> String;
}

#[near_bindgen]
impl PayOnUse {
    #[payable]
    pub fn deposit(&mut self) {
        let account_id = env::signer_account_id();
        let deposit = env::attached_deposit();

        self.deposits.insert(&account_id, &deposit);
    }

    pub fn pause_stream(&self, stream_id: String) {
        ext_ft::pause_stream(
            stream_id,
            &ROCKETO_CONTRACT,
            5,
            100000000000000,
        ).then(ext_self::my_callback(
            &env::current_account_id(), // this contract's account id
            1, // yocto NEAR to attach to the callback
            1_000_000_000_000 // gas to attach to the callback
        ));
    }

    pub fn my_callback(&self) -> String {
        assert_eq!(
            env::promise_results_count(),
            1,
            "This is a callback method"
        );

        // handle the result from the cross contract call this method is a callback for
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Failed => "oops!".to_string(),
            PromiseResult::Successful(result) => {
                "Wow!".to_string()
            },
        }
    }
}

#[cfg(not(target_arch = "wasm32"))]
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
    //     VMContext {
    //         current_account_id: "alice_near".to_string(),
    //         signer_account_id: "bob_near".to_string(),
    //         signer_account_pk: vec![0, 1, 2],
    //         predecessor_account_id: "carol_near".to_string(),
    //         input,
    //         block_index: 0,
    //         block_timestamp: 0,
    //         account_balance: 0,
    //         account_locked_balance: 0,
    //         storage_usage: 0,
    //         attached_deposit: 0,
    //         prepaid_gas: 10u64.pow(18),
    //         random_seed: vec![0, 1, 2],
    //         is_view,
    //         output_data_receivers: vec![],
    //         epoch_height: 0,
    //     }
    // }
    //
    // #[test]
    // fn set_get_message() {
    //     let context = get_context(vec![], false);
    //     testing_env!(context);
    //     let mut contract = StatusMessage::default();
    //     contract.set_status("hello".to_string());
    //     assert_eq!(
    //         "hello".to_string(),
    //         contract.get_status("bob_near".to_string()).unwrap()
    //     );
    // }
    //
    // #[test]
    // fn get_nonexistent_message() {
    //     let context = get_context(vec![], true);
    //     testing_env!(context);
    //     let contract = StatusMessage::default();
    //     assert_eq!(None, contract.get_status("francis.near".to_string()));
    // }
}
