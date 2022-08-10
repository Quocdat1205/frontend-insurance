import { createAsyncThunk } from '@reduxjs/toolkit';
import { getNonce, logIn } from 'services/insurance';

export const loginAction = createAsyncThunk('auth/login', async (payload: any) => {
    const { walletAddress, contractCaller } = payload;
    const nounce = await getNonce(walletAddress);
    const signatureString = `Sign message with nonce: ${nounce}`;
    const signature = await contractCaller.current?.sign(signatureString);
    const data = await logIn({ walletAddress, signature });
    return data;
});
