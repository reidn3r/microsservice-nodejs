import { z } from 'zod';
export const confirmUserAdapter = { 
    schema:{
        params: z.object({
                url: z.string(),
                email: z.string().email()
            })
    }
}