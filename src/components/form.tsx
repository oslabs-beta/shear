import React, { useRef, FormEvent, useEffect, useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store.ts";
import { nameInput, arnInput, funcParamsInput, powerValueInput, testVolInput, checksInput } from "../formData/infoSlice.ts";
import { runOptimizer } from "../formData/resultsSlice.ts";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
    ARN: z.string().min(30, {
        message: "ARN should be a string that resembles something like arn:aws:lambda:us-east-2:150614410391:function:FuncName",
    }),
    parameters: z.string().optional(),
    min: z.coerce.number().int().positive({
        message: "Must be a positive integer"
    }),
    max: z.coerce.number().int().positive({
        message: "Must be a positive integer"
    }),
    intervals: z.coerce.number().int().positive({
        message: "Must be a positive integer"
    }),
    volume: z.coerce.number().int().positive({
        message: "Must be a positive integer"
    }),
    detail: z.boolean().optional(),
    concurrent: z.boolean().optional(),
})

export function ShearForm() {
    const resultsState = useSelector((state: RootState) => state.results);
    const formState = useSelector((state: RootState) => state.info);
    const dispatch = useDispatch();
    const arnRef = useRef<HTMLInputElement | null>(null);
    const funcParamsRef = useRef<HTMLInputElement | null>(null);
    const memoryRef = useRef<string[]>([]);
    const [show, setShow] = useState(false); //this is used to toggle whether the loading bar shows up
    const [checkedItems, setCheckedItems] = React.useState([false, false])

    useEffect(() => {
        if (formState.ARN !== '') {
            dispatch(runOptimizer(formState))
        }
    }, [formState])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ARN: "",
            detail: true,
            concurrent: false,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        console.log('submitted');
        setShow(true);
        // // dispatch(nameInput(memoryRef.current[5]))
        dispatch(arnInput(values.ARN));
        dispatch(funcParamsInput(values.parameters));
        dispatch(powerValueInput([values.min, values.max, values.intervals]));
        dispatch(testVolInput(values.volume))
        dispatch(checksInput([values.detail, values.concurrent]))
    }
    useEffect(() => {
        setShow(false)
    }, [resultsState])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="ARN"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>ARN</FormLabel>
                            <FormControl>
                                <Input placeholder="arn:aws:lambda:us-east-2:150614410391:function:TestFunc" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="parameters"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Function Parameters</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="min"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Min</FormLabel>
                            <FormControl>
                                <Input placeholder="128"  {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="max"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Max</FormLabel>
                            <FormControl>
                                <Input placeholder="2048" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="intervals"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Intervals</FormLabel>
                            <FormControl>
                                <Input placeholder="10" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="volume"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Volume</FormLabel>
                            <FormControl>
                                <Input placeholder="20" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="detail"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Detailed Search
                                </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="concurrent"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Concurrent Search
                                </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}