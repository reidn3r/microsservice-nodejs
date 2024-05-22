import { z } from 'zod';

export const GenNewURLAdapter = { 
    schema:{
        params: z.object({
                email: z.string().email()
            })
    }
}