export const claimReq ={
    adminOnly: (c:any) => c.role == "Administrator",
    adminOrRepo: (c:any) => c.role == "Administrator" || c.role == "CustomerAccount",
    repo: (c:any) => c.role == "CustomerAccount"
}