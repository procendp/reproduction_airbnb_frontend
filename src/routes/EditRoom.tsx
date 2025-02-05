import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaBath, FaBed, FaWonSign } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import {
  editRoom,
  getAmenities,
  getCategories,
  getRoom,
  IEditRoomVariables,
  IUploadRoomVariables,
  IUploadError,
  uploadRoom,
} from "../api";
import useHostOnlyPage from "../components/HostOnlyPage";
import ProtectedPage from "../components/ProtectedPage";
import { IAmenity, ICategory, IRoomDetail } from "../types";
export default function EditRoom() {
  const { roomPk } = useParams();
  const { register, handleSubmit, setValue } = useForm<IUploadRoomVariables>();
  const { data, isLoading } = useQuery<IRoomDetail>(["rooms", roomPk], getRoom);
  const { isLoading: isCategoriesLoading, data: categories } = useQuery<
    ICategory[]
  >(["categories"], getCategories);
  const { isLoading: isAmenitiesLoading, data: amenities } = useQuery<
    IAmenity[]
  >(["amenities"], getAmenities);
  const navigate = useNavigate();
  const toast = useToast();
  const mutation = useMutation<IRoomDetail, IUploadError, IEditRoomVariables>(
    editRoom,
    {
      onSuccess: (data) => {
        toast({
          status: "success",
          position: "top",
          title: "Room Updated",
        });
        navigate(`/rooms/${data.id}`);
      },
    }
  );
  const onSubmit = (data: IUploadRoomVariables) => {
    if (roomPk) {
      const roomData: IEditRoomVariables = { ...data, roomPk };
      mutation.mutate(roomData);
    }
  };
  let roomAmenityPks: number[] = [];
  //   data?.amenities.map((amenity) => {
  //     roomAmenityPks.push(amenity.pk);
  //   });
  const roomAmenityPksTotal = roomAmenityPks;
  return (
    <ProtectedPage>
      <Box pb={40} mt={10} px={{ base: 10, lg: 40 }}>
        <Container>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            <>
              <Heading w="100%" textAlign={"center"}>
                {`Edit Room: ${data?.name}`}
              </Heading>
              <VStack
                spacing={6}
                as="form"
                mt={5}
                onSubmit={handleSubmit(onSubmit)}
              >
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <FormHelperText>Write the name of your room</FormHelperText>
                  <Input
                    {...register("name", { required: true })}
                    required
                    type="text"
                    defaultValue={data?.name}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Country</FormLabel>
                  <Input
                    {...register("country", { required: true })}
                    required
                    type="text"
                    defaultValue={data?.country}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>City</FormLabel>
                  <Input
                    {...register("city", { required: true })}
                    required
                    type="text"
                    defaultValue={data?.city}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Address</FormLabel>
                  <Input
                    {...register("address", { required: true })}
                    required
                    type="text"
                    defaultValue={data?.address}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Price</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children={<FaWonSign />} />
                    <Input
                      {...register("price", { required: true })}
                      required
                      type="number"
                      min={0}
                      defaultValue={data?.price}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel>Rooms</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children={<FaBed />} />
                    <Input
                      {...register("rooms", { required: true })}
                      required
                      type="number"
                      min={0}
                      defaultValue={data?.rooms}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel>Toilets</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children={<FaBath />} />
                    <Input
                      {...register("toilets", { required: true })}
                      required
                      type="number"
                      min={0}
                      defaultValue={data?.toilets}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    {...register("description", { required: true })}
                    required
                    defaultValue={data?.description}
                  />
                </FormControl>
                <FormControl>
                  <Checkbox
                    {...register("pet_friendly")}
                    defaultChecked={data?.pet_friendly}
                  >
                    Pet friendly
                  </Checkbox>
                </FormControl>
                <FormControl>
                  <FormLabel>Kind of room</FormLabel>
                  <Select
                    required
                    {...register("kind", { required: true })}
                    placeholder="-- Choose a kind --"
                    defaultValue={data?.kind}
                  >
                    <option value="entire_place">Entire Place</option>
                    <option value="private_room">Private Room</option>
                    <option value="shared_room">Shared Room</option>
                  </Select>
                  <FormHelperText>
                    What kind of room are you renting?
                  </FormHelperText>
                </FormControl>
                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select
                    {...register("category", { required: true })}
                    required
                    placeholder="-- Choose a category --"
                    defaultValue={data?.category.pk}
                  >
                    {categories?.map((category) => (
                      <option key={category.pk} value={category.pk}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                  <FormHelperText>
                    What category describes your room?
                  </FormHelperText>
                </FormControl>
                <FormControl>
                  <FormLabel>Amenities</FormLabel>
                  <Grid templateColumns={"1fr 1fr"} gap="5">
                    {amenities?.map((amenity) => (
                      <Box key={amenity.pk}>
                        <Checkbox
                          defaultChecked={Boolean(
                            roomAmenityPksTotal.find((pk) => pk === amenity.pk)
                          )}
                          {...register("amenities")}
                          value={amenity.pk}
                        >
                          {amenity.name}
                        </Checkbox>
                        <FormHelperText>{amenity.description}</FormHelperText>
                      </Box>
                    ))}
                  </Grid>
                </FormControl>
                {mutation.isError ? (
                  <Text color={"red.500"}>Something went wrong</Text>
                ) : null}
                <Button
                  isLoading={mutation.isLoading}
                  type="submit"
                  size={"lg"}
                  w="100%"
                  colorScheme={"red"}
                >
                  Update
                </Button>
              </VStack>
            </>
          )}
        </Container>
      </Box>
    </ProtectedPage>
  );
}
